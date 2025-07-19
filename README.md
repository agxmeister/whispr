## Whispr

MCP server providing access to the WP Toolkit REST API.

### How to build

Build the STDIO entry point (index.js):

`npx tsc`

Build the Claude Desktop Extension (whispr.dxt):

`npx ts-node scripts/build-dxt-manifest.ts`
`npx @anthropic-ai/dxt pack`

### How to configure

Generate the MCP configuration:

`npm run build-mcp-configuration`

The output will look like this:

```json
{
    "type": "stdio",
    "command": "node",
    "args": [
        "/path/to/whispr/dist/index.js",
        "--config",
        "/path/to/whispr/services.json"
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
