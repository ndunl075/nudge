/**
 * THE DECISION ENGINE
 * Matches the incident to the correct tool in the toolbox.
 */

function investigate(tableauMetric, prList, bugList) {
    const metricName = tableauMetric.metric_name.toLowerCase();
    
    // 1. SETUP REPORT
    let report = {
        status: "Inconclusive",
        analysis: "No clear root cause found.",
        evidence: [],
        action_label: "Manual Review",
        action_id: "MANUAL", // The key we send to the button
        action_params: ""    // Extra data (like PR ID)
    };

    // 2. CHECK FOR RECENT CODE CHANGES (The "Rollback" Scenario)
    const recentPr = prList.find(pr => {
        const minutesAgo = (new Date() - new Date(pr.merged_at)) / 1000 / 60;
        return minutesAgo < 60; 
    });

    if (recentPr && tableauMetric.trend_status === 'negative') {
        report.status = "Root Cause Found (Code)";
        report.analysis = `🚨 **Bad Deployment Detected**\nMetric spiked immediately after PR #${recentPr.id} was merged.`;
        report.evidence = [`GitHub: PR #${recentPr.id} merged < 1hr ago`];
        report.action_label = `Rollback PR #${recentPr.id}`;
        report.action_id = "ROLLBACK_PR";
        report.action_params = recentPr.id;
        return report;
    }

    // 3. CHECK FOR INFRASTRUCTURE LOAD (The "Scale" Scenario)
    // If no bad code, but Latency/CPU is high -> We need more servers.
    if (metricName.includes('latency') || metricName.includes('cpu') || metricName.includes('load')) {
        report.status = "Capacity Constraint";
        report.analysis = `⚠️ **High Traffic Detected**\nServer load is critical. No recent code changes, suggesting organic traffic spike.`;
        report.evidence = [`Metric: ${tableauMetric.metric_name} is critical`, "GitHub: No recent merges"];
        report.action_label = "Scale Up Server Cluster (+2 Nodes)";
        report.action_id = "SCALE_INFRA";
        report.action_params = "cluster-prod-01";
        return report;
    }

    // 4. CHECK FOR SERVICE ERRORS (The "Restart" Scenario)
    // If we see 500 errors or Memory issues -> Turn it off and on again.
    if (metricName.includes('memory') || metricName.includes('error') || metricName.includes('churn')) {
        report.status = "Service Degraded";
        report.analysis = `⚠️ **Memory Leak Suspected**\nService health is declining over time. A restart often clears stale processes.`;
        report.evidence = [`Metric: ${tableauMetric.metric_name} is anomalous`];
        report.action_label = "Restart Production Service";
        report.action_id = "RESTART_SERVICE";
        report.action_params = "payment-service-v2";
        return report;
    }

    return report;
}

module.exports = { investigate };