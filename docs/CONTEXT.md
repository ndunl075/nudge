# PROJECT NUDGE: AI CONTEXT FILE
**Mission:** Build "Nudge," an AI Intern that lives in Slack.
**Key Philosophy:** "Sit back and relax." Nudge is proactive. It doesn't just show data; it does the prep work.

## THE "INTERN" LOOP
1. **Trigger:** Tableau Pulse detects a change.
2. **Investigation (The "Black Box"):** Nudge (Node.js) queries Semantic Layer to find *why*.
3. **Drafting:** Nudge prepares the response (e.g., drafts the email, queues the Slack post).
4. **Presentation:** Nudge pings the user: "I did X, Y, and Z. Click here to finish."

## PRIZE TARGETS
- **Actionable Analytics:** The user must be able to complete a complex task with **one click** inside Slack.
- **Semantic Modeling:** The AI must reference *business context* (e.g., "The server outage caused this"), not just math.