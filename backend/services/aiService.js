const tools = require('./toolService'); // This file needs to be created!

// Helper to simulate "Thinking time"
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function generateInsight(data) {
    console.log("🕵️‍♂️ Nudge Investigator is starting...");
    await sleep(500); // Simulate thinking
    
    // 1. INITIAL ASSESSMENT
    let investigationSteps = [];
    let rootCause = "Unknown";
    let recommendedAction = "Investigate Manually";
    let analysisText = "";

    // 2. THE INVESTIGATION LOOP (Agent Logic)
    
    // SCENARIO A: Negative Trend (Engineering Issue)
    if (data.metric_name.includes("Churn") || data.trend_status === 'warning') {
        console.log("   -> Scenario: Negative Trend. Checking Engineering...");
        
        // Step A: Check GitHub
        const gitHub = await tools.checkGitHubDeploys();
        investigationSteps.push(`🔍 Checked GitHub: ${gitHub.details}`);
        
        // Step B: Check Jira
        const jira = await tools.checkJiraTickets();
        investigationSteps.push(`🔍 Checked Jira: ${jira.details}`);

        // SYNTHESIS
        if (gitHub.found && jira.found) {
            rootCause = "Bad Deploy";
            analysisText = `📉 **${data.metric_name} dropped.**\n*Root Cause Analysis:* I found a correlation. A code merge (${gitHub.details}) happened right before bug tickets (${jira.details}) started spiking.`;
            recommendedAction = "🚨 Rollback PR #892";
        }

    // SCENARIO B: Positive Trend (Sales Win)
    } else if (data.trend_status === 'success') {
        console.log("   -> Scenario: Positive Trend. Checking Sales...");
        
        // Step A: Check Salesforce
        const sfdc = await tools.checkSalesforceDeals();
        investigationSteps.push(`🔍 Checked Salesforce: ${sfdc.details}`);

        // SYNTHESIS
        if (sfdc.found) {
            rootCause = "Big Deal Closed";
            analysisText = `🚀 **${data.metric_name} is up!**\n*Root Cause Analysis:* This isn't random. The 'Acme Corp' deal just closed for $1.2M, driving the spike.`;
            recommendedAction = "🎉 Send Kudo to Sales";
        }
    
    // SCENARIO C: Budget/Infrastructure
    } else {
        console.log("   -> Scenario: Anomaly. Checking Infrastructure...");
        
        investigationSteps.push(`🔍 Checked AWS Console: Found orphan ML cluster.`);
        
        rootCause = "Orphaned Resource";
        analysisText = `⚠️ **Cost Anomaly Detected.**\n*Root Cause:* An ML Training Cluster has been running for 48 hours with 0% utilization.`;
        recommendedAction = "💸 Terminate Instance";
    }

    // 3. FORMAT THE REPORT
    const formattedLog = investigationSteps.map(step => `✅ ${step.replace('🔍 ', '')}`).join("\n");

    return {
        analysis: analysisText,
        proactive_log: formattedLog,
        action: recommendedAction
    };
}

module.exports = { generateInsight };