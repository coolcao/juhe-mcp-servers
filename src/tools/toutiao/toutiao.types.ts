export interface ToutiaoData {
  uniquekey: string;
  title: string;
  date: string;
  category: string;
  author_name: string;
  url: string;
  thumbnail_pic_s: string;
  thumbnail_pic_s02: string;
  thumbnail_pic_s03: string;
  is_content: string;
}

export interface ToutiaoContentResult {
  uniquekey: string;
  detail: ToutiaoData;
  content: string;
}

export interface ToutiaoResult {
  stat: string;
  data: ToutiaoData[];
  page: string;
  pageSize: string;
}