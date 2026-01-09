require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');
const path = require('path');

// --- IMPORTS ---
const { fetchPulseMetric } = require('./services/tableauService');
const { generateInsight } = require('./services/aiService');
const { getRecentMerges, revertPullRequest } = require('./services/gitService');
const { getRecentBugs } = require('./services/jiraService');

console.log("🟢 Nudge is starting up...");

// --- CHECK FOR KEYS ---
const HAS_SLACK_KEYS = process.env.SLACK_BOT_TOKEN && process.env.SLACK_APP_TOKEN;

if (!HAS_SLACK_KEYS) {
    console.log("⚠️  KEYS MISSING -> ENTERING SIMULATION MODE");
    console.log("------------------------------------------------");
    runSimulation();
} else {
    startSlackApp();
}

// ==========================================
// 1. THE SIMULATION
// ==========================================
async function runSimulation() {
    try {
        console.log("1️⃣  Fetching Mock Data...");
        const data = await fetchPulseMetric(); 
        console.log("2️⃣  Waking up the Intern (AI)...");
        const insight = await generateInsight(data, "Simulation Mode: No external API context.");
        
        console.log("\n🤖 --- NUDGE INTERN REPORT ---");
        console.log(`ANALYSIS: ${insight.analysis}`);
        console.log(`ACTION:   [ ${insight.action} ]`);
        console.log("-------------------------------\n");
        console.log("✅ Simulation Complete.");
    } catch (error) {
        console.error("❌ Logic Error:", error);
    }
}

// ==========================================
// 2. THE REAL APP (SOCKET MODE ENABLED)
// ==========================================
function startSlackApp() {
    console.log("🔑 Keys found! Starting Real Server...");
    
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        socketMode: true,
        appToken: process.env.SLACK_APP_TOKEN
    });

    // Load UI Template
    const templatePath = path.join(__dirname, 'views', 'nudgeCard.json');
    let rawTemplate = "";
    try { 
        rawTemplate = fs.readFileSync(templatePath, 'utf8'); 
    } catch (e) { 
        console.error("⚠️ Template missing. Please ensure 'views/nudgeCard.json' exists."); 
    }

    // TRIGGER: /nudge-now
    app.command('/nudge-now', async ({ command, ack, respond }) => {
        await ack();
        console.log("📥 Received /nudge-now command");

        try {
            // 1. Get Tableau Data (Pulse)
            // This now uses the TABLEAU_METRIC_ID from your .env
            const data = await fetchPulseMetric();
            
            // 2. INVESTIGATE: Hit GitHub & Jira APIs
            console.log("🔎 Checking GitHub and Jira...");
            const recentPRs = await getRecentMerges(); // Defined in services/githubService.js
            const recentBugs = await getRecentBugs();  // Defined in services/jiraService.js

            // 3. Construct Context for the AI
            const context = `
                Tableau Metric: ${data.metric_name} is currently ${data.current_value} (Trend: ${data.trend_status}).
                Context from Tableau: ${data.context || "None"}
                
                RECENT GITHUB ACTIVITY:
                ${recentPRs.length > 0 ? recentPRs.map(pr => `- PR #${pr.id} '${pr.title}' by ${pr.author} (merged ${pr.merged_at})`).join('\n') : "No recent merges."}
                
                RECENT JIRA ACTIVITY:
                ${recentBugs.length > 0 ? recentBugs.map(bug => `- Bug ${bug.key}: ${bug.summary}`).join('\n') : "No new bugs reported."}
            `;

            // 4. Generate Insight with Real Context
            const insight = await generateInsight(data, context);

            // 5. Sanitize for JSON (Escape quotes/newlines to prevent breaking JSON)
            const safeAnalysis = (insight.analysis || "").replace(/"/g, '\\"').replace(/\n/g, '\\n');
            const safeLog = (insight.proactive_log || "").replace(/"/g, '\\"').replace(/\n/g, '\\n');
            const safeAction = (insight.action || "Check Tableau").replace(/"/g, '\\"');

            // 6. Inject into Template
            let blockString = rawTemplate
                .replace('{{metricName}}', data.metric_name)
                .replace('{{currentValue}}', data.current_value)
                .replace('{{aiAnalysis}}', safeAnalysis)
                .replace('{{proactiveLog}}', safeLog) 
                .replace('{{actionLabel}}', safeAction);
            
            const blocks = JSON.parse(blockString).blocks;

            // 7. STATUS INDICATOR (The "Real Tool" Polish)
            // Determine color based on trend (Red = Bad, Green = Good/Neutral)
            let statusColor = "#36a64f"; // Green Default
            let statusEmoji = "✅";

            if (data.trend_status === 'negative') {
                statusColor = "#FF0000"; // Red
                statusEmoji = "⚠️";
            } else if (data.trend_status === 'neutral') {
                statusColor = "#e8e8e8"; // Grey
                statusEmoji = "ℹ️";
            }
            
            // 8. Send the card with Color Attachment
            await respond({ 
                text: `${statusEmoji} Nudge Alert: ${data.metric_name}`,
                attachments: [
                    {
                        color: statusColor,
                        blocks: blocks
                    }
                ]
            });

        } catch (error) {
            console.error("❌ Command Error:", error);
            await respond("❌ Error processing data. Check terminal logs.");
        }
    });

    // ACTION: Button Click (The Rollback)
    app.action('btn_approve', async ({ body, ack, respond }) => {
        await ack();
        await respond({ replace_original: false, text: "🤖 On it... executing workflow." });

        try {
            // Execute the REAL fix (Revert PR #892 - or make this dynamic based on AI output)
            // In a pro version, you'd pass the PR ID in the button's 'value' field
            const success = await revertPullRequest(892); 

            if (success) {
                await respond({ replace_original: false, text: "✅ Done. GitHub Action triggered to revert the PR." });
            } else {
                await respond({ replace_original: false, text: "❌ Failed to trigger GitHub API. Check permissions in .env." });
            }
        } catch (err) {
            console.error(err);
            await respond({ replace_original: false, text: "❌ Error executing workflow." });
        }
    });

    (async () => {
        await app.start();
        console.log('⚡️ Nudge Agent is ONLINE and connected to Slack via Socket Mode!');
    })();
}