import { KomodoClient } from "komodo_client";
import * as core from "@actions/core";

async function run() {
  try {
    // Get inputs
    const komodoUrl = core.getInput("komodo-url", { required: true });
    const apiKey = core.getInput("api-key", { required: true });
    const apiSecret = core.getInput("api-secret", { required: true });
    const stackName = core.getInput("stack-name", { required: true });
    const servicesInput = core.getInput("services");
    const waitForCompletion = core.getInput("wait-for-completion") === "true";
    const showLogs = core.getInput("show-logs") === "true";
    const pullBeforeDeploy = core.getInput("pull-before-deploy") === "true";

    // Parse services
    const services = servicesInput
      ? servicesInput.split(",").map((s) => s.trim()).filter((s) => s)
      : undefined;

    core.info(`Deploying stack: ${stackName}`);
    core.info(`Komodo URL: ${komodoUrl}`);
    if (services) {
      core.info(`Services: ${services.join(", ")}`);
    } else {
      core.info(`Services: All services`);
    }
    core.info(`Wait for completion: ${waitForCompletion}`);

    // Initialize Komodo client
    const client = new KomodoClient(komodoUrl, {
      type: "api-key",
      params: {
        key: apiKey,
        secret: apiSecret,
      },
    });

    // Prepare request params
    const requestParams = { stack: stackName };
    if (services) {
      requestParams.services = services;
    }

    // Pull stack before deploy if enabled
    if (pullBeforeDeploy) {
      core.info("Pulling stack before deployment...");
      const pullUpdate = await client.execute_and_poll("PullStack", requestParams);

      core.info(`✓ Pull completed!`);
      core.info(`Pull Status: ${pullUpdate.status}`);
      core.info(`Pull Success: ${pullUpdate.success ? "Yes" : "No"}`);

      if (!pullUpdate.success) {
        throw new Error(`Pull stack failed: ${pullUpdate.status}`);
      }
    }

    // Deploy stack
    if (waitForCompletion) {
      core.info("Deploying stack and waiting for completion...");
      const update = await client.execute_and_poll("DeployStack", requestParams);

      // Output results
      const updateId = update._id?.$oid || update.id;
      core.setOutput("update-id", updateId);
      core.setOutput("status", update.status);

      // Show logs if enabled
      if (showLogs && update.logs) {
        core.startGroup("📋 Deployment Logs");
        update.logs.forEach((log, index) => {
          core.info(`\n[${index + 1}] Stage: ${log.stage}`);
          if (log.command) {
            core.info(`    Command: ${log.command}`);
          }
          if (log.stdout) {
            core.info(`    Output: ${log.stdout}`);
          }
          if (log.stderr) {
            core.info(`    Stderr: ${log.stderr}`);
          }
          core.info(`    Success: ${log.success ? "✓" : "✗"}`);
          if (log.start_ts && log.end_ts) {
            const duration = log.end_ts - log.start_ts;
            core.info(`    Duration: ${duration}ms`);
          }
        });
        core.endGroup();
      }

      // Summary
      core.info(`\n✓ Deployment completed successfully!`);
      core.info(`Update ID: ${updateId}`);
      core.info(`Status: ${update.status}`);
      core.info(`Success: ${update.success ? "Yes" : "No"}`);
      if (update.start_ts && update.end_ts) {
        const totalDuration = update.end_ts - update.start_ts;
        core.info(`Total Duration: ${totalDuration}ms`);
      }
    } else {
      core.info("Deploying stack (trigger only)...");
      const update = await client.execute("DeployStack", requestParams);

      const updateId = update._id?.$oid || update.id;
      core.setOutput("update-id", updateId);
      core.setOutput("status", "triggered");

      core.info(`✓ Deployment triggered successfully!`);
      core.info(`Update ID: ${updateId}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error, null, 2);
    core.setFailed(`Action failed: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      core.debug(error.stack);
    }
  }
}

run();
