require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');
const path = require('path');

// --- IMPORTS ---
const { fetchPulseMetric } = require('./services/tableauService');
const { getRecentBugs } = require('./services/jiraService');

// NEW: Import the Investigation Brain and the Action Toolbox
const { investigate } = require('./services/investigationService');
const { getRecentMerges, rollbackPr, scaleCluster, restartService } = require('./services/actionService');

console.log("🟢 Nudge is starting up...");

// --- CHECK FOR KEYS ---
const HAS_SLACK_KEYS = process.env.SLACK_BOT_TOKEN && process.env.SLACK_APP_TOKEN;

if (!HAS_SLACK_KEYS) {
    console.log("⚠️  KEYS MISSING -> CHECK .ENV FILE");
    process.exit(1);
} else {
    startSlackApp();
}

// ==========================================
// THE REAL APP
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
            // 1. GATHER DATA (The Evidence)
            const data = await fetchPulseMetric();
            const recentPRs = await getRecentMerges();
            const recentBugs = await getRecentBugs();

            // 2. RUN INVESTIGATION (The Brain)
            // This decides IF it's a code issue, traffic issue, or memory issue
            const result = investigate(data, recentPRs, recentBugs);
            
            // 3. FORMAT EVIDENCE LIST
            const evidenceText = result.evidence.length > 0 
                ? result.evidence.map(e => `• ${e}`).join("\n") 
                : "No specific evidence found.";

            // 4. INJECT INTO TEMPLATE
            let blockString = rawTemplate
                .replace('{{metricName}}', data.metric_name)
                .replace('{{currentValue}}', data.current_value)
                .replace('{{aiAnalysis}}', result.analysis)
                .replace('{{proactiveLog}}', evidenceText)
                .replace('{{actionLabel}}', result.action_label);

            const blocks = JSON.parse(blockString).blocks;

            // 5. PACK ACTION INTO BUTTON (Dynamic Routing)
            // We store "ACTION_ID|PARAMS" in the button value (e.g. "ROLLBACK_PR|892")
            const actionsBlock = blocks.find(b => b.type === 'actions');
            if (actionsBlock) {
                const approveBtn = actionsBlock.elements.find(e => e.action_id === 'btn_approve');
                if (approveBtn) {
                    approveBtn.value = `${result.action_id}|${result.action_params}`;
                }
            }

            // 6. STATUS COLOR (Red if Critical, Grey if Manual)
            let statusColor = result.status.includes("Manual") ? "#e8e8e8" : "#FF0000";

            // 7. SEND CARD
            await respond({ 
                text: `Nudge Alert: ${result.status}`,
                attachments: [ { color: statusColor, blocks: blocks } ]
            });

        } catch (error) {
            console.error("❌ Command Error:", error);
            await respond("❌ Error processing data. Check terminal logs.");
        }
    });

    // --- ACTION ROUTER (The Switch Board) ---
    app.action('btn_approve', async ({ body, ack, respond }) => {
        await ack();
        
        // 1. DECODE THE BUTTON VALUE
        // "ROLLBACK_PR|892" -> actionId="ROLLBACK_PR", param="892"
        const buttonValue = body.actions[0].value;
        const [actionId, param] = buttonValue.split('|');

        await respond({ replace_original: false, text: `🤖 *Nudge Agent:* Initiating ${actionId}...` });

        let success = false;
        let msg = "";

        // 2. EXECUTE THE RIGHT TOOL
        switch (actionId) {
            case 'ROLLBACK_PR':
                success = await rollbackPr(param);
                msg = `✅ *Success:* Rollback workflow triggered for PR #${param}. Engineers notified.`;
                break;
            case 'SCALE_INFRA':
                success = await scaleCluster(param);
                msg = `✅ *Success:* Auto-Scaling Group '${param}' increased by 2 nodes. Capacity expanding.`;
                break;
            case 'RESTART_SERVICE':
                success = await restartService(param);
                msg = `✅ *Success:* Service '${param}' successfully restarted. Memory flushed.`;
                break;
            default:
                msg = "❌ Error: Unknown Action Type or Manual Review required.";
        }

        if (success) {
            await respond({ replace_original: false, text: msg });
        } else {
            await respond({ replace_original: false, text: "❌ Action Failed. Please check system logs." });
        }
    });

    // --- DENY ACTION (The Manual Override) ---
    app.action('btn_deny', async ({ body, ack, respond }) => {
        await ack();

        await respond({
            replace_original: true,
            text: "⚠️ *Action Denied.* Usage of Nudge auto-fix was declined.",
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `🛑 *Auto-Fix Denied by <@${body.user.id}>*`
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "The issue has been flagged for *Manual Review*. No automated actions were taken."
                    }
                }
            ]
        });
    });

    (async () => {
        await app.start();
        console.log('⚡️ Nudge Agent is ONLINE and connected to Slack via Socket Mode!');
    })();
}