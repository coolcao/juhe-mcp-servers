import { Resp } from "../juhe.types.js";
import { postForm } from "../request.js";
import { ToutiaoContentResult, ToutiaoResult } from "./toutiao.types.js";
import { z } from "zod";
import { buildCallToolResult, buildTextContent, ToolDefinition } from "../../helper.js";

const BASE_URL = 'http://v.juhe.cn/toutiao';
const API_KEY = process.env.JUHE_TOUTIAO_NEWS_KEY || '';

async function getToutiaoNews(type: string = 'top', page: number = 1, page_size: number = 20) {
  const url = `${BASE_URL}/index`;

  const formData = new FormData();
  formData.append('key', API_KEY);
  formData.append('type', type);
  formData.append('page', `${page}`);
  formData.append('page_size', `${page_size}`);

  const data = await postForm<Resp<ToutiaoResult>>(url, formData);
  return data;
}

async function getToutiaoContent(uniquekey: string) {
  const url = `${BASE_URL}/content`;

  const formData = new FormData();
  formData.append('key', API_KEY);
  formData.append('uniquekey', `${uniquekey}`);

  const data = await postForm<Resp<ToutiaoContentResult>>(url, formData);
  return data;
}

async function getToutiaoContentInfo(uniquekey: string) {
  const res = await getToutiaoContent(uniquekey);
  if (res.error_code !== 0) {
    throw new Error('获取今日头条新闻内容失败');
  }

  const { detail, content } = res.result;

  let txt = `标题：${detail.title}\n 日期：${detail.date}\n 来源：${detail.author_name}\n 链接：${detail.url}\n 缩略图：${detail.thumbnail_pic_s}\n 内容：${content} \\n`;

  return txt;
}

async function getToutiaoNewsInfo(type: string = 'top', page: number = 1, page_size: number = 20): Promise<string> {
  const res = await getToutiaoNews(type, page, page_size);

  if (res.error_code !== 0) {
    throw new Error('获取今日头条新闻失败');
  }

  const { data } = res.result;

  let txt = '今日头条新闻：\n';
  data.forEach((item) => {
    txt += `uniquekey:${item.uniquekey}\n 标题：${item.title}\n 日期：${item.date}\n 来源：${item.author_name}\n 链接：${item.url}\n 缩略图：${item.thumbnail_pic_s}\n\n`;
  });

  return txt;
}

const toutiaoNewsTool: ToolDefinition<{
  type: z.ZodEnum<["top", "guonei", "guoji", "yule", "tiyu", "junshi", "keji", "caijing", "youxi", "qiche", "jiankang"]>;
}> = {
  name: 'getToutiaoNews',
  description: '获取今日头条新闻，重点记录uniquekey',
  paramsSchema: z.object({
    type: z.enum(['top', 'guonei', 'guoji', 'yule', 'tiyu', 'junshi', 'keji', 'caijing', 'youxi', 'qiche', 'jiankang'])
      .describe('新闻类型:top(推荐,默认);guonei(国内);guoji(国际);yule(娱乐);tiyu(体育);junshi(军事);keji(科技);caijing(财经);youxi(游戏);qiche(汽车);jiankang(健康)')
  }),
  callback: async ({ type }) => {
    return {
      content: [
        { type: 'text', text: await getToutiaoNewsInfo(type) }
      ]
    }
  },
}

const toutiaoContentTool: ToolDefinition<{ uniquekey: z.ZodString }> = {
  name: 'getToutiaoContent',
  description: '获取今日头条新闻内容',
  paramsSchema: z.object({ uniquekey: z.string().describe('新闻唯一标识uniquekey') }),
  callback: async ({ uniquekey }) => {
    return buildCallToolResult([buildTextContent(await getToutiaoContentInfo(uniquekey))]);
  },
}

export {
  toutiaoNewsTool,
  toutiaoContentTool
}
