import dotenv from 'dotenv';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {getServer} from "./server";

dotenv.config();

(async () => {
    const server = await getServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
