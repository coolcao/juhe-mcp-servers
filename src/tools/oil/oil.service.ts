import { buildCallToolResult, buildTextContent, ToolDefinition } from "../../helper.js";
import { Resp } from "../juhe.types.js";
import { postForm } from "../request.js";
import { OilResult } from "./oil.types.js";

const BASE_URL = 'http://apis.juhe.cn';
const API_KEY = process.env.JUHE_OIL_KEY || '';

async function getOilPrice() {
  const url = `${BASE_URL}/gnyj/query`;

  const formData = new FormData();
  formData.append('key', API_KEY);

  const res = await postForm<Resp<OilResult[]>>(url, formData);
  return res;

}

async function getOilPriceInfo() {
  const res = await getOilPrice();
  if (res.error_code !== 0) {
    throw new Error('获取油价信息失败');
  }

  const { result } = res;
  let txt = '全国油价：\n';
  result.forEach((item) => {
    txt += `${item.city}：\n 92号汽油：¥${item['92h']}\n 95号汽油：¥${item['95h']}\n 98号汽油：¥${item['98h']}\n 0号柴油：¥${item['0h']}\n\n`;
  });

  return txt;
}

const oil: ToolDefinition<{}> = {
  name: 'getOilPrice',
  description: '获取全国油价',
  callback: async () => {
    return buildCallToolResult([buildTextContent(await getOilPriceInfo())]);
  },
}

export {
  oil as oilTool
}
