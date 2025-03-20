import { z } from "zod";
import { buildCallToolResult, buildTextContent, ToolDefinition } from "../../helper.js";
function sayHello(name: string) {
  return `Hello ${name}!`;
}
const helloTool: ToolDefinition<{ name: z.ZodString }> = {
  name: "hello",
  description: "打招呼",
  paramsSchema: z.object({ name: z.string().describe('你的名字') }),
  callback: async ({ name }) => {
    return buildCallToolResult([buildTextContent(sayHello(name))]);
  }
}

export {
  helloTool as hello
}