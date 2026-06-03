# Scripts

## build-configuration.ts

Generates a Whispr configuration file from edge definition files in `./edges`.

```
npx tsx scripts/build-configuration.ts [--filter <edge-name>] [--output <filename>]
```

- `--filter` — comma-separated list of edge names to include (case-insensitive); omit to include all edges
- `--output` — output path (defaults to `config.json`)
- `--input` — input directory for edge files (defaults to `./edges`)

The script automatically prefixes env variable names with `EDGE_<EDGE_NAME>_` (e.g. `API_KEY` → `EDGE_DEFECTDOJO_API_KEY`).

## build-mcp-configuration.ts

Generates the MCP server configuration snippet for attaching Whispr to an AI client (Claude Code, Claude Desktop, etc.).

```
npx tsx scripts/build-mcp-configuration.ts [--config <config-file>]
```

- `--config` — path to the Whispr config file to use (defaults to `config.json`)

The output is a JSON snippet with placeholder descriptions for each env variable. Fill in the values and add it under `mcpServers` in your MCP client config.

## build-dxt-manifest.ts

Generates the DXT manifest for packaging Whispr as a Claude Desktop Extension.
