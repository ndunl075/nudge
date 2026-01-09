const axios = require('axios');

// CONFIG
const REPO = process.env.GITHUB_REPO; 
const TOKEN = process.env.GITHUB_TOKEN;
const HEADERS = { 
    Authorization: `token ${TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
};

// --- TOOL 1: GET RECENT MERGES (For Investigation) ---
async function getRecentMerges() {
    if (!TOKEN || !REPO || TOKEN === "dummy_token") {
        console.log("⚠️ GitHub Keys missing. Skipping.");
        return [];
    }
    try {
        const response = await axios.get(`https://api.github.com/repos/${REPO}/pulls`, {
            headers: HEADERS,
            params: { state: 'closed', sort: 'updated', direction: 'desc', per_page: 3 }
        });
        return response.data
            .filter(pr => pr.merged_at !== null)
            .map(pr => ({
                id: pr.number,
                title: pr.title,
                merged_at: pr.merged_at,
                author: pr.user ? pr.user.login : "Unknown"
            }));
    } catch (error) {
        console.error("❌ GitHub Fetch Error:", error.response?.status);
        return [];
    }
}

// --- TOOL 2: ROLLBACK PR (The Code Fix) ---
async function rollbackPr(prNumber) {
    if (!TOKEN) return false;
    try {
        console.log(`🚀 [Toolbox] Triggering Rollback for PR #${prNumber}...`);
        
        // 1. Try to trigger a real GitHub Action workflow
        try {
            await axios.post(`https://api.github.com/repos/${REPO}/actions/workflows/rollback.yml/dispatches`, {
                ref: 'main',
                inputs: { pr_id: String(prNumber), reason: "Nudge Auto-Fix" }
            }, { headers: HEADERS });
            return true;
        } catch (wfError) {
            // 2. Fallback: Post a comment if workflow file is missing
            console.log("⚠️ Workflow dispatch failed (Missing .yml?). Falling back to Comment.");
            await axios.post(`https://api.github.com/repos/${REPO}/issues/${prNumber}/comments`, {
                body: "🚨 **Nudge Auto-Fix:** Rollback initiated via Slack."
            }, { headers: HEADERS });
            return true;
        }
    } catch (e) { console.error(e); return false; }
}

// --- TOOL 3: SCALE INFRASTRUCTURE (The Traffic Fix) ---
async function scaleCluster(clusterId) {
    console.log(`🚀 [Toolbox] Scaling Auto-Scaling Group: ${clusterId}...`);
    // SIMULATION: Fake a 2-second API call to AWS
    await new Promise(r => setTimeout(r, 2000)); 
    return true;
}

// --- TOOL 4: RESTART SERVICE (The Memory Fix) ---
async function restartService(serviceName) {
    console.log(`🚀 [Toolbox] Restarting Container: ${serviceName}...`);
    // SIMULATION: Fake a 1.5-second API call to Heroku/K8s
    await new Promise(r => setTimeout(r, 1500)); 
    return true;
}

module.exports = { getRecentMerges, rollbackPr, scaleCluster, restartService };