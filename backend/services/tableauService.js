const fs = require('fs');
const path = require('path');

// Define path to the scenarios file
const scenariosPath = path.join(__dirname, '../data/scenarios.json');

async function fetchPulseMetric() {
    // 🎛️ DIRECTOR MODE: CHANGE THIS KEY TO TEST DIFFERENT VIBES
    // Options: "CRITICAL_FAILURE" | "RECORD_HIGH" | "BUDGET_ALERT"
    const CURRENT_SCENE = "CRITICAL_FAILURE";

    console.log(`🎬 ACTION: Playing Scene [${CURRENT_SCENE}]`);

    let scenarios = {};
    try {
        // Load fresh every time so you can edit JSON without restarting server
        const rawData = fs.readFileSync(scenariosPath, 'utf8');
        scenarios = JSON.parse(rawData);
    } catch (e) {
        console.error("⚠️ Failed to load scenarios.json. using fallback.", e.message);
        return { 
            metric_name: "Error Loading Data", 
            current_value: "0", 
            trend_status: "neutral" 
        };
    }

    // Return the selected scene, or fallback to critical failure if key is wrong
    return scenarios[CURRENT_SCENE] || scenarios["CRITICAL_FAILURE"];
}

module.exports = { fetchPulseMetric };