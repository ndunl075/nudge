const axios = require('axios');

async function getRecentBugs() {
    // Return empty array if keys are missing (prevents crash)
    if (!process.env.JIRA_API_TOKEN || !process.env.JIRA_DOMAIN) {
        console.log("⚠️ Jira Keys missing. Skipping check.");
        return [];
    }
    
    const AUTH = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
    
    try {
        const response = await axios.get(`https://${process.env.JIRA_DOMAIN}/rest/api/3/search`, {
            headers: { Authorization: `Basic ${AUTH}`, Accept: 'application/json' },
            params: { jql: "issuetype = Bug ORDER BY created DESC", maxResults: 3 }
        });
        return response.data.issues.map(issue => ({ key: issue.key, summary: issue.fields.summary }));
    } catch (error) {
        console.error("Jira API Error:", error.message);
        return [];
    }
}

module.exports = { getRecentBugs };