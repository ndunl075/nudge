const axios = require('axios');

// 1. CONFIGURATION
// These come directly from your real .env file
const POD_URL = process.env.TABLEAU_POD_URL; // https://10ax.online.tableau.com
const SITE_ID = process.env.TABLEAU_SITE_ID; // nudge
const PAT_NAME = process.env.TABLEAU_PAT_NAME;
const PAT_SECRET = process.env.TABLEAU_PAT_SECRET;
const DEFAULT_METRIC_ID = process.env.TABLEAU_METRIC_ID;

// 2. AUTHENTICATION (The Handshake)
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

// 3. DATA FETCHING (The Real Business Logic)
async function fetchPulseMetric(metricId = DEFAULT_METRIC_ID) {
    if (!metricId) {
        return { 
            metric_name: "Configuration Error", 
            current_value: "Missing ID", 
            trend_status: "negative",
            context: "Please add TABLEAU_METRIC_ID to your .env file."
        };
    }

    // A. Get a Fresh Token
    const token = await getTableauToken();
    if (!token) {
        return { 
            metric_name: "Authentication Failed", 
            current_value: "Auth Error", 
            trend_status: "neutral",
            context: "Could not log in to Tableau. Check PAT keys."
        };
    }

    try {
        console.log(`📡 Contacting Tableau Pulse for Metric: ${metricId}...`);
        
        // B. Call the Pulse API
        const response = await axios.get(`${POD_URL}/api/-/pulse/metrics/${metricId}`, {
            headers: { 
                'X-Tableau-Auth': token,
                'Accept': 'application/json'
            }
        });

        const data = response.data;
        
        // C. Standardize the Output for Nudge
        // We map the messy API response to a clean object for the Slack Card
        return {
            metric_name: data.name || "Business Metric",
            // Round to 2 decimals if it's a number, otherwise pass string
            current_value: data.latest_value ? String(data.latest_value) : "No Data", 
            trend_status: data.sentiment || "neutral", // positive, negative, neutral
            context: data.description || "No additional context provided by Tableau."
        };

    } catch (error) {
        console.error("❌ API Request Failed:", error.response?.status, error.response?.data);
        return { 
            metric_name: "Connection Error", 
            current_value: "API Fail", 
            trend_status: "neutral",
            context: `Failed to fetch metric ${metricId}. Status: ${error.response?.status}`
        };
    }
}

module.exports = { fetchPulseMetric };