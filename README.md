# 🤖 Nudge: The AI Strategy Intern
Backend logic for the Tableau Data Dev Hackathon.

## 🚀 Quick Start
1.  **Install:** `npm install`
2.  **Run:** `node backend/index.js`
3.  **Result:** The bot will run in "Simulation Mode" if no keys are found.

## 🎬 Director Mode (For Demo Videos)
To force specific scenarios (Crash, Record High, etc) without waiting for real data:

1.  Open `backend/services/tableauService.js`
2.  Change `CURRENT_SCENE`:
    * `"CRITICAL_FAILURE"` -> Simulate a metric crash (Churn).
    * `"RECORD_HIGH"` -> Simulate a winning trend (DAU).
    * `"BUDGET_ALERT"` -> Simulate a cost anomaly.
3.  Run `node backend/index.js` to see the new personality.

## 🔑 Environment Variables (.env)
Create a `.env` file in `backend/` with these keys to go Live:

```ini
# SLACK (From App Dashboard)
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...

# TABLEAU (From Pulse API)
TABLEAU_PAT_NAME=...
TABLEAU_PAT_SECRET=...
TABLEAU_METRIC_ID=...