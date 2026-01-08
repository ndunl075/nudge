require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');
const path = require('path');

// --- IMPORTS ---
const { fetchPulseMetric } = require('./services/tableauService');
const { generateInsight } = require('./services/aiService');
const { executeWorkflow } = require('./services/actionService');

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
        const insight = await generateInsight(data);
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
        socketMode: true, // Switched to true
        appToken: process.env.SLACK_APP_TOKEN // Required for Socket Mode
    });

    // Load UI Template (looking for nudgeCard.json in /views)
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
            const data = await fetchPulseMetric();
            const insight = await generateInsight(data);

            // Sanitize for JSON
            const safeAnalysis = (insight.analysis || "").replace(/"/g, '\\"').replace(/\n/g, '\\n');
            const safeLog = (insight.proactive_log || "").replace(/"/g, '\\"').replace(/\n/g, '\\n');
            const safeAction = (insight.action || "Check Tableau").replace(/"/g, '\\"');

            // Inject into Template
            let blockString = rawTemplate
                .replace('{{metricName}}', data.metric_name)
                .replace('{{currentValue}}', data.current_value)
                .replace('{{aiAnalysis}}', safeAnalysis)
                .replace('{{proactiveLog}}', safeLog) 
                .replace('{{actionLabel}}', safeAction);
            
            const blocks = JSON.parse(blockString).blocks;
            await respond({ blocks: blocks, text: "Nudge Alert: Action Required" });

        } catch (error) {
            console.error("❌ Command Error:", error);
            await respond("❌ Error processing data. Check terminal logs.");
        }
    });

    // ACTION: Button Click
    app.action('btn_approve', async ({ body, ack, respond }) => {
        await ack();
        await respond({ replace_original: false, text: "🤖 On it... executing workflow." });
        const result = await executeWorkflow('btn_approve', body.user.id);
        await respond({ replace_original: false, text: result.message });
    });

    (async () => {
        await app.start(); // Port not strictly needed for Socket Mode but doesn't hurt
        console.log('⚡️ Nudge Agent is ONLINE and connected to Slack via Socket Mode!');
    })();
}