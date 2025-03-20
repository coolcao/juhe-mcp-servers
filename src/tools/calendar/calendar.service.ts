import { z } from "zod";
import { buildCallToolResult, buildTextContent, ToolDefinition } from "../../helper.js";
import { Resp } from "../juhe.types.js";
import { postForm } from "../request.js";
import { CalendarDayResult, CalendarMonthResult, CalendarYearResult } from "./calendar.types.js";

const BASE_URL = 'http://v.juhe.cn/calendar';
const API_KEY = process.env.JUHE_CALENDAR_API_KEY || '';

async function getDay(date: string) {
  const url = `${BASE_URL}/day`;
  const formData = new FormData();
  formData.append('key', API_KEY);
  formData.append('date', date);

  const res = await postForm<Resp<CalendarDayResult>>(url, formData);
  return res;
}

async function getMonth(yearMonth: string) {
  const url = `${BASE_URL}/month`;
  const formData = new FormData();
  formData.append('key', API_KEY);
  formData.append('year-month', yearMonth);
  const res = await postForm<Resp<CalendarMonthResult>>(url, formData);
  return res;
}

async function getYear(year: string) {
  const url = `${BASE_URL}/year`;
  const formData = new FormData();
  formData.append('key', API_KEY);
  formData.append('year', year);
  const res = await postForm<Resp<CalendarYearResult>>(url, formData);
  return res;
}

async function getMonthInfo(yearMonth: string) {
  const res = await getMonth(yearMonth);
  if (res.error_code !== 0) {
    throw new Error('获取万年历近期假期失败');
  }
  const { data } = res.result;
  let txt = '当月万年历：\n';
  txt += `月份：${data["year-month"]}\n`;
  data.holiday_array.forEach(h => {
    txt += `节假日：${h.name} \t 日期：${h.festival} \n`;
    txt += `描述：${h.desc} \n`;
    txt += `拼假建议：${h.rest}\n`;
  });
  return txt;
}

async function getDayInfo(date: string) {
  const res = await getDay(date);
  if (res.error_code !== 0) {
    throw new Error('获取当年的假期列表');
  }

  const { data } = res.result;
  let txt = '当天万年历：\n';
  txt += `日期：${data.date} ${data.weekday}\n`;
  txt += `农历：${data.lunarYear} ${data.lunar} \t 生肖：${data.animalsYear} \n`;
  if (data.holiday) {
    txt += `节假日：${data.holiday} \n`;
  }
  if (data.suit) {
    txt += `宜：${data.suit} \n`;
  }
  if (data.avoid) {
    txt += `忌：${data.avoid} \n`;
  }

  txt += `描述：${data.desc} \n`;

  return txt;
}

async function getYearInfo(year: string) {
  const res = await getYear(year);
  if (res.error_code !== 0) {
    throw new Error('获取万年历当年信息失败');
  }
  const { data } = res.result;
  let txt = '当年万年历：\n';
  txt += `年份：${data.year}\n`;
  txt += `节假日列表：`;
  data.holiday_list.forEach(h => {
    txt += `节假日：${h.name} \t 日期：${h.startday} \n`;
  });

  return txt;
}

const calendarDayTool: ToolDefinition<{ date: z.ZodString }> = {
  name: "calendar_day",
  description: "万年历-获取当天的详细信息，根据传入日期返回当天详细信息",
  paramsSchema: z.object({ date: z.string().describe('指定日期,格式为YYYY-MM-DD,如月份和日期小于10,则取个位,如:2012-1-1') }),
  callback: async ({ date }) => {
    return buildCallToolResult([buildTextContent(await getDayInfo(date))]);
  }
}

const calendarMonthTool: ToolDefinition<{ yearMonth: z.ZodString }> = {
  name: "calendar_month",
  description: "万年历-获取近期假期，根据传入的月份返回近期的假期列表（起始年份为2013年）",
  paramsSchema: z.object({ yearMonth: z.string().describe('	指定月份,格式为YYYY-MM,如月份和日期小于10,则取个位,如:2012-1') }),
  callback: async ({ yearMonth }) => {
    return buildCallToolResult([buildTextContent(await getMonthInfo(yearMonth))]);
  }
}

const calendarYearTool: ToolDefinition<{ year: z.ZodString }> = {
  name: "calendar_year",
  description: "万年历-获取当年的节假日列表",
  paramsSchema: z.object({ year: z.string().describe('指定年份,格式为YYYY,如:2015') }),
  callback: async ({ year }) => {
    return buildCallToolResult([buildTextContent(await getYearInfo(year))]);
  }
}



export {
  calendarDayTool,
  calendarMonthTool,
  calendarYearTool,
}