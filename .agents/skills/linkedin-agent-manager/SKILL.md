---
name: linkedin-agent-manager
description: Manages the background scheduler, checks if the LinkedIn publisher agent is checking the queue, starts or stops the schedule, and inspects logs.
---

### Overview
This skill provides instructions on how to manage, schedule, check status, stop, or debug the background agent that checks the queue for the Autonomous LinkedIn Publisher.

### Common Tasks

#### Task 1: Check if the Background Agent is Running
1. Run the `manage_task` tool with `Action: "list"`.
2. Look for any active background tasks running with a description/prompt related to "Run the linkedin-publisher skill".
3. If such a task exists and is active, the agent is running. Otherwise, it is stopped.

#### Task 2: Start the Background Agent (Turn the Schedule On)
1. If no active task is found in Task 1, start the schedule.
2. Use the `schedule` tool with the following parameters:
   - `CronExpression`: `* * * * *` (to run every 1 minute)
   - `Prompt`: `"Run the linkedin-publisher skill. Check for pending requests, generate drafts/images, send for approval, and publish approved posts."`

#### Task 3: Stop the Background Agent (Turn the Schedule Off)
1. Run the `manage_task` tool with `Action: "list"`.
2. Find the Task ID of the running scheduler task (e.g., `7d26c180-7673-46ef-8006-5c8feda36b66/task-xxx`).
3. Run the `manage_task` tool with `Action: "kill"` and specify the `TaskId`.

#### Task 4: View Background Agent Logs
1. Run the `manage_task` tool with `Action: "status"` for the scheduler's Task ID, or check the task's log URI directly.
2. View the log file using `view_file` to verify the execution iterations and check if requests are being processed successfully.
