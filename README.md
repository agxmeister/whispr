## Whispr

MCP server providing access to the WP Toolkit REST API.

### How to build

Build the STDIO entry point (index.js):

`npm run build`

Build the Claude Desktop Extension (whispr.dxt):

`npx ts-node scripts/build-dxt-manifest.ts`
`npx @anthropic-ai/dxt pack`

### How to configure

Generate the services' configuration:

`npx ts-node scripts/build-configuration.ts`

Generate the MCP configuration:

`npx ts-node scripts/build-mcp-configuration.ts`

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
        "MIRO_API_KEY": "",
        "JIRA_CREDENTIALS": ""
    }
}
```

Add these lines to your MCP client's configuration file and fill in the environment variables.

### How to troubleshoot

`npx @modelcontextprotocol/inspector`
