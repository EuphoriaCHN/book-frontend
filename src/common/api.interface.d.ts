export interface RESPONSE_DATA {
  status_code: number;
  data?: any;
  e?: any;
}

// GET BOOK LIST
export type IGetBookList = {
  offset?: number;
  limit?: number;
};