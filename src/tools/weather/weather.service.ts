
import { z } from 'zod';
import { buildCallToolResult, buildTextContent, ToolDefinition } from '../../helper.js';
import { Resp } from '../juhe.types.js';
import { postForm } from '../request.js';
import { WeatherResult } from './weather.type.js';

const BASE_URL = "http://apis.juhe.cn";
const API_KEY = process.env.JUHE_WEATHER_KEY || "";

const widMap = new Map<string, string>([
  [
    "00",
    "晴"
  ],
  [
    "01",
    "多云"
  ],
  [
    "02",
    "阴"
  ],
  [
    "03",
    "阵雨"
  ],
  [
    "04",
    "雷阵雨"
  ],
  [
    "05",
    "雷阵雨伴有冰雹"
  ],
  [
    "06",
    "雨夹雪"
  ],
  [
    "07",
    "小雨"
  ],
  [
    "08",
    "中雨"
  ],
  [
    "09",
    "大雨"
  ],
  [
    "10",
    "暴雨"
  ],
  [
    "11",
    "大暴雨"
  ],
  [
    "12",
    "特大暴雨"
  ],
  [
    "13",
    "阵雪"
  ],
  [
    "14",
    "小雪"
  ],
  [
    "15",
    "中雪"
  ],
  [
    "16",
    "大雪"
  ],
  [
    "17",
    "暴雪"
  ],
  [
    "18",
    "雾"
  ],
  [
    "19",
    "冻雨"
  ],
  [
    "20",
    "沙尘暴"
  ],
  [
    "21",
    "小到中雨"
  ],
  [
    "22",
    "中到大雨"
  ],
  [
    "23",
    "大到暴雨"
  ],
  [
    "24",
    "暴雨到大暴雨"
  ],
  [
    "25",
    "大暴雨到特大暴雨"
  ],
  [
    "26",
    "小到中雪"
  ],
  [
    "27",
    "中到大雪"
  ],
  [
    "28",
    "大到暴雪"
  ],
  [
    "29",
    "浮尘"
  ],
  [
    "30",
    "扬沙"
  ],
  [
    "31",
    "强沙尘暴"
  ],
  [
    "53",
    "霾"
  ]
]);

async function getWeather(city: string) {
  const url = `${BASE_URL}/simpleWeather/query`;
  // 使用form-data发送数据
  const formData = new FormData();
  formData.append('city', city);
  formData.append('key', API_KEY);

  const data = await postForm<Resp<WeatherResult>>(url, formData);
  return data;
}

async function getWeatherInfo(city: string): Promise<string> {
  const res = await getWeather(city);
  if (res.error_code !== 0) {
    throw new Error(`Error fetching weather data: ${res.reason}`);
  }

  const { realtime, future } = res.result;

  let txt = city + '的天气信息：\n';
  txt += `实时天气：${realtime.info}，${realtime.temperature}°C，${widMap.get(realtime.wid)}，${realtime.direct}，湿度：${realtime.humidity}%，空气质量指数：${realtime.aqi}\n\n`;
  txt += `未来天气：\n`;
  for (const weather of future) {
    txt += `${weather.date}：${weather.weather}，${weather.temperature}，白天:${widMap.get(weather.wid.day)};夜间:${widMap.get(weather.wid.night)};${weather.direct}\n`;
  }
  return txt;
}

const weatherTool: ToolDefinition<{ city: z.ZodString }> = {
  name: 'getWeather',
  description: '获取某个城市的天气信息',
  paramsSchema: z.object({
    city: z.string().describe('城市名称')
  }),
  callback: async ({ city }) => {
    const weatherInfo = await getWeatherInfo(city);
    return buildCallToolResult([buildTextContent(weatherInfo)]);
  }
};

export { weatherTool };