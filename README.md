## Whispr

Whisper is the universal MCP server that allows your AI client of choice access to virtually any service that exposes the REST API according to the OpenAPI specification.

We call the services attached to Whisper "edges," highlighting that you enrich your AI with new capabilities - adding new edges.

To attach your service of choice, you need only provide its OpenAPI specification and basic description, which will give the AI an idea of what purpose your service might help.

You can refer to the /edges directory to get the idea of how the configuration might look.

Whisper is designed to work locally on your laptop or desktop computer, so you can feel safe providing access tokens for attached services.

### How to use

To use Whisper, you must have Node.js v20 or later installed on your computer, unless you plan to install Whisper as a DXT extension of your Claude Desktop.

Node.js will also be needed to generate configuration files (see below).

#### How to build

To build Whisper (dist/index.js):

`npm run build`

To build Whisper as a Claude Desktop Extension (whispr.dxt):

`npx tsx scripts/build-dxt-manifest.ts`
`npx @anthropic-ai/dxt pack`

#### How to configure

Generate the Whisper configuration file:

`npx tsx scripts/build-configuration.ts`

TLS certificates are not verified by default, so services with self-signed certificates work as is.
Set `"rejectUnauthorized": true` in an edge's `api.request` to verify the certificate for that edge.

Generate the configuration to attach Whisper as an MCP server to your AI of choice:

`npx tsx scripts/build-mcp-configuration.ts`

The output will look like this:

```json
{
    "type": "stdio",
    "command": "node",
    "args": [
        "/path/to/whispr/dist/index.js",
        "--config",
        "/path/to/whispr/config.json"
    ],
    "env": {
        "EDGE_MIRO_API_KEY": ""
    }
}
```

Add these lines to the MCP client configuration file and fill in the environment variables.

### Pinned specifications

An edge may point `api.specification` at a `url` or at a `path` under `resources/specifications`.
Prefer `path` for anything you rely on: a specification fetched at runtime is defined by whoever
controls that host, and it drifts from the version your instance actually runs. The DefectDojo,
Graylog and WebDriver edges ship pinned copies.

Name the file after the service version it was taken from, so several versions can live side by
side and an edge picks the one matching its instance. To add one, download the specification from
your own instance, commit it, and point the edge's `specification.path` at it, e.g.:

`curl -s 'https://defectdojo.example.com/api/v2/oa3/schema/?format=yaml' -o resources/specifications/defectdojo-2.54.1.yaml`

### How to troubleshoot

`npx @modelcontextprotocol/inspector`
