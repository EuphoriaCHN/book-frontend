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

// GET BOOK BY ID
export type IGetBookByID = {
  id: string | number;
};

// GET BOOK
export type IGetChapter = {
  searchText?: string;
  offset: number;
  limit: number;
};

// GET ONE BOOK
export type IGetOneChapter = {
  address?: string;
};

// GET BOOK XMIND IMAGE
export type IGetBookXmindImage = {
  imageName: string;
  extra?: string;
  mock?: boolean;
};
