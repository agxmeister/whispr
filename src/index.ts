import dotenv from 'dotenv';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {getServer} from "./server";
import minimist from 'minimist';
import path from 'path';
import {getServices} from "./utils";

dotenv.config();
const args = minimist(process.argv.slice(2));

(async () => {
    const server = await getServer(await getServices(args.services
        ? path.resolve(args.services)
        : undefined
    ));
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
