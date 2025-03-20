export interface CalendarDay {
  holiday: string; // 节假日
  avoid: string;  // 忌
  animalsYear: string;  // 生肖
  desc: string; // 描述
  weekday: string;  // 周几
  suit: string; // 宜
  lunarYear: string;  // 农历纪年
  lunar: string;  // 农历
  'year-month': string; // 年份-月份
  date: string; // 日期
}

export interface HolidayStatus {
  date: string;
  status: string; // 	1:放假,2:上班
}

export interface Holiday {
  name: string; // 节假日名称
  festival: string; // 放假日期
  desc: string; // 描述
  rest: string; // 拼假建议
  list: HolidayStatus[]; // 日期列表
}

export interface CalendarMonth {
  year: string; // 年份
  'year-month': string; // 年-月
  holiday: string;  // 序列化为字符串的节假日
  holiday_array: Holiday[]; // 节假日数组
}

export interface CalendarYearHoliday {
  name: string;
  startday: string;
}
export interface CalendarYear {
  holidaylist: string;
  year: string;
  holiday_list: CalendarYearHoliday[];
}

export interface CalendarDayResult {
  data: CalendarDay;
}
export interface CalendarMonthResult {
  data: CalendarMonth;
}
export interface CalendarYearResult {
  data: CalendarYear;
}