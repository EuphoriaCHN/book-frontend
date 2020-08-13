import axios, { AxiosResponse } from 'axios';

import * as I from './common/api.interface';

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      return error.response.data;
    }
    return error;
  }
);

type AxiosRequest = {
  method?: 'get' | 'GET' | 'post' | 'POST';
  url: string;
  params?: {};
  data?: {};
};

const prefix = '/api';

const request: (
  params: AxiosRequest
) => Promise<AxiosResponse<I.RESPONSE_DATA>> = (params) =>
  axios({
    method: params.method || 'get',
    url: `${prefix}${params.url}`,
    params: params.params || {},
    data: params.data || {},
  });

export const GET_BOOK_LIST = (query: I.IGetBookList) =>
  request({
    url: `/book/getBookList`,
    params: query,
  });

export const GET_BOOK_BY_ID = (query: I.IGetBookByID) =>
  request({
    url: '/book/getBookById',
    params: query,
  });

export const GET_ONE_CHAPTER = (query: I.IGetOneChapter) =>
  request({
    url: '/book/getOneChapter',
    params: query,
  });

export const MAKE_BOOK_IMAGE_URL = (query: I.IGetBookXmindImage) => {
  // if (query.mock) {
  //   return `${window.location.protocol}/static/images/1001中华人民共和国安全生产法.png`;
  // }
  return `${window.location.protocol}/static/images/${query.imageName}.png`;
};

export const MAKE_PDF_URL = (query: { path: string }) => {
  return `/static/${query.path}`;
};
