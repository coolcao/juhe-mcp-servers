import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { weatherTool } from './tools/weather/weather.service.js';
import { toutiaoNewsTool, toutiaoContentTool } from "./tools/toutiao/toutiao.service.js";
import { hello } from "./tools/hello/hello.service.js";
import { registerTool } from "./helper.js";
import { oilTool } from "./tools/oil/oil.service.js";

const server = new McpServer({
  name: 'juhe-mcp-servers',
  version: '1.0.0',
});

registerTool(server, hello);
registerTool(server, weatherTool);
registerTool(server, toutiaoNewsTool);
registerTool(server, toutiaoContentTool);
registerTool(server, oilTool);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});