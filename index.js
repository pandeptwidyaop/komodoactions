import { KomodoClient, Types } from "komodo_client";

const client = new KomodoClient("https://komodo.internal.trofeo.cloud", {
    type: "api-key",
    params: {
        key: "K-POp6I7gDEkM76UsCmeOH1v8DXmv48vq2LK3BrBZu",
        secret: "S-oy23IKTD5eRxBw0c4KNmSlcBVZHsjCSuTSZoePsI"
    }
});


const stackDetails = await client.execute_and_poll("PullStack", {
    stack: "dev-pijatmu",
    services: ["app"]
});

console.log(stackDetails);
/**
 * OUTPUT:
 * {
  _id: { '$oid': '68ebb5d214031cfc3e41036c' },
  operation: 'PullStackService',
  start_ts: 1760277970326,
  success: true,
  operator: '6863388ec0cd7429d33c2f14',
  target: { type: 'Stack', id: '68da33324a10a14d75ed2b96' },
  logs: [
    {
      stage: 'Service/s',
      command: '',
      stdout: 'Execution requested for Stack service/s app',
      stderr: '',
      success: true,
      start_ts: 1760277970403,
      end_ts: 1760277970403
    },
    {
      stage: 'Write Environment File',
      command: '',
      stdout: 'Environment file written to "/etc/komodo/stacks/dev-pijatmu/.env"',
      stderr: '',
      success: true,
      start_ts: 1760277970419,
      end_ts: 1760277970419
    },
    {
      stage: 'Compose Pull',
      command: 'cd /etc/komodo/stacks/dev-pijatmu && docker compose -p dev-pijatmu -f compose.yaml --env-file .env pull app',
      stdout: '',
      stderr: ' app Pulling \n app Pulled \n',
      success: true,
      start_ts: 1760277970938,
      end_ts: 1760277971582
    }
  ],
  end_ts: 1760277971982,
  status: 'Complete'
}
 */

const deployDetails = await client.execute_and_poll("DeployStack", {
    stack: "dev-pijatmu",
    services: ["app"]
});

console.log(deployDetails);
/**
 * OUTPUT:
 * {
  _id: { '$oid': '68ebb5d414031cfc3e41036f' },
  operation: 'DeployStackService',
  start_ts: 1760277972770,
  success: true,
  operator: '6863388ec0cd7429d33c2f14',
  target: { type: 'Stack', id: '68da33324a10a14d75ed2b96' },
  logs: [
    {
      stage: 'Service/s',
      command: '',
      stdout: 'Execution requested for Stack service/s app',
      stderr: '',
      success: true,
      start_ts: 1760277972850,
      end_ts: 1760277972850
    },
    {
      stage: 'Write Environment File',
      command: '',
      stdout: 'Environment file written to "/etc/komodo/stacks/dev-pijatmu/.env"',
      stderr: '',
      success: true,
      start_ts: 1760277972865,
      end_ts: 1760277972865
    },
    {
      stage: 'Compose Pull',
      command: 'cd /etc/komodo/stacks/dev-pijatmu && docker compose -p dev-pijatmu -f compose.yaml --env-file .env pull app',
      stdout: '',
      stderr: ' app Pulling \n app Pulled \n',
      success: true,
      start_ts: 1760277973452,
      end_ts: 1760277974065
    },
    {
      stage: 'Compose Up',
      command: 'cd /etc/komodo/stacks/dev-pijatmu && docker compose -p dev-pijatmu -f compose.yaml --env-file .env up -d app',
      stdout: '',
      stderr: ' Container pijatmu-db  Running\n' +
        ' Container pijatmu-app  Recreate\n' +
        ' Container pijatmu-app  Recreated\n' +
        ' Container pijatmu-app  Starting\n' +
        ' Container pijatmu-app  Started\n',
      success: true,
      start_ts: 1760277974065,
      end_ts: 1760277974681
    }
  ],
  end_ts: 1760277975109,
  status: 'Complete'
}
 */