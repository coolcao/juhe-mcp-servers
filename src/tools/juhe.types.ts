export interface Resp<T> {
  reason: string;
  result: T;
  error_code: number; // 0为查询成功
}