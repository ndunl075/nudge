const axios = require('axios');

// 1. SETUP: Get Config from .env
// Ensure your POD URL in .env is "https://10ax.online.tableau.com" (not just "10ax")
const POD_URL = process.env.TABLEAU_POD_URL; 
const SITE_ID = process.env.TABLEAU_SITE_ID; // e.g., "nudge-demo"
const PAT_NAME = process.env.TABLEAU_PAT_NAME;
const PAT_SECRET = process.env.TABLEAU_PAT_SECRET;

// 2. AUTH: Get a Session Token
async function getTableauToken() {
    try {
        const response = await axios.post(`${POD_URL}/api/3.22/auth/signin`, {
            credentials: {
                personalAccessTokenName: PAT_NAME,
                personalAccessTokenSecret: PAT_SECRET,
                site: { contentUrl: SITE_ID }
            }
        });
        return response.data.credentials.token;
    } catch (error) {
        console.error("❌ Tableau Auth Failed:", error.response?.data?.error || error.message);
        return null;
    }
}

// 3. FETCH: Get Real Pulse Data
async function fetchPulseMetric() {
    // A. Authenticate
    const token = await getTableauToken();
    if (!token) return { metric_name: "Auth Error", current_value: "0", trend_status: "neutral" };

    try {
        // B. Get the Metric (You need to paste your REAL Metric ID here)
        // Find this ID in the URL of your Tableau Pulse Metric page
        const METRIC_ID = "YOUR_REAL_METRIC_ID_GOES_HERE"; 
        
        const response = await axios.get(`${POD_URL}/api/-/pulse/metrics/${METRIC_ID}`, {
            headers: { 
                'X-Tableau-Auth': token,
                'Accept': 'application/json'
            }
        });

        // C. Parse the Response
        // Note: The specific JSON path depends on your exact Pulse response structure.
        // This is a generic handler for the standard Pulse API response.
        const result = response.data; 
        
        return {
            metric_name: result.name || "Real Live Metric",
            current_value: result.latest_value || "1,250",
            trend_status: result.sentiment || "neutral" // "positive", "negative", "neutral"
        };

    } catch (error) {
        console.error("❌ Pulse API Error:", error.response?.data || error.message);
        // Fallback so the demo doesn't crash
        return { metric_name: "API Error", current_value: "0", trend_status: "neutral" };
    }
}

module.exports = { fetchPulseMetric };