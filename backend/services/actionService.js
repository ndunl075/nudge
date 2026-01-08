// services/actionService.js

/**
 * Executes the specific workflow associated with a button click.
 * @param {string} actionId - The ID of the button clicked (e.g., 'btn_approve')
 * @param {string} userId - The Slack User ID of the person who clicked it
 * @returns {Promise<{message: string}>} - The result message to display in Slack
 */
async function executeWorkflow(actionId, userId) {
    console.log(`⚙️  Executing Workflow: '${actionId}' for user ${userId}`);
    
    // Simulate processing time (e.g., API calls to Salesforce or Email Service)
    await new Promise(r => setTimeout(r, 1500));

    switch (actionId) {
        case 'btn_approve':
            return {
                status: "success",
                // Note: Slack uses single asterisks (*) for bold, not double (**).
                message: "✅ *Done.* I sent the emails to the 150 affected users and updated the Salesforce Case."
            };

        default:
            console.warn(`⚠️  Unknown action: ${actionId}`);
            return { 
                status: "error",
                message: "❓ Unknown action ID. No workflow executed." 
            };
    }
}

module.exports = { executeWorkflow };