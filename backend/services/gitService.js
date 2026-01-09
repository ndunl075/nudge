const axios = require('axios');

// CONFIG: Get the specific repo from .env (e.g., "your_name/nudge-demo-target")
const REPO = process.env.GITHUB_REPO; 
const TOKEN = process.env.GITHUB_TOKEN;

// HEADERS: We use these for every request
const HEADERS = { 
    Authorization: `token ${TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
};

// 1. INVESTIGATE: Find recent merges in your safe demo repo
async function getRecentMerges() {
    // Safety Check: If keys are missing, return empty instead of crashing
    if (!TOKEN || !REPO || TOKEN === "dummy_token") {
        console.log("⚠️ GitHub Keys missing or dummy. Skipping check.");
        return [];
    }

    try {
        console.log(`🔎 Pinging GitHub Repo: ${REPO}...`);
        
        // Fetch closed Pull Requests
        const response = await axios.get(`https://api.github.com/repos/${REPO}/pulls`, {
            headers: HEADERS,
            params: { state: 'closed', sort: 'updated', direction: 'desc', per_page: 3 }
        });
        
        // Filter and Format
        return response.data
            .filter(pr => pr.merged_at !== null)
            .map(pr => ({
                id: pr.number,
                title: pr.title,
                merged_at: pr.merged_at,
                author: pr.user.login
            }));

    } catch (error) {
        // Log the specific error so you know if it's a 404 (Bad Repo) or 401 (Bad Token)
        console.error("❌ GitHub API Error:", error.response?.status, error.response?.statusText);
        return [];
    }
}

// 2. ACTION: The Rollback Button
async function revertPullRequest(prNumber) {
    if (!TOKEN) return false;
    try {
        // For the Hackathon, we return 'true' to simulate a success
        // unless you strictly want to run a real GitHub Action.
        console.log(`✅ SIMULATING ROLLBACK of PR #${prNumber}`);
        return true; 
    } catch (error) {
        console.error("Rollback failed:", error.message);
        return false;
    }
}

// CRITICAL: This allows index.js to see the functions
module.exports = { getRecentMerges, revertPullRequest };