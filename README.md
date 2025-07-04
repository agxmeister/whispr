## Whispr

MCP server providing access to the WP Toolkit REST API.

### How to build

Build the STDIO entry point (index.js):

`npx tsc`

Build the Claude Desktop Extension (whispr.dxt):

`npx @anthropic-ai/dxt pack`

### How to configure

```
{
    "mcp": {
        "servers": {
            "whispr": {
                "type": "stdio",
                "command": "node",
                "args": [
                    "<realpath-to-stdio-entry-point>"
                ],
                "env": {
                    "API_BASE_URL": "http://<your-plesk-hostname>:8880/api/modules/wp-toolkit",
                    "API_KEY": "<your-plesk-secret-key>"
                }
            }
        }
    }
}
```
### How to troubleshoot

`npx @modelcontextprotocol/inspector`
