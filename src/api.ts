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
  method: 'get' | 'GET' | 'post' | 'POST';
  url: string;
  params?: {};
  data?: {};
};

const prefix = '/api';

const request: (params: AxiosRequest) => Promise<AxiosResponse<I.RESPONSE_DATA>> = (params) =>
  axios({
    method: params.method,
    url: `${prefix}${params.url}`,
    params: params.params || {},
    data: params.data || {}
  });

// PING
export const GET_BOOK_LIST = (query: I.IGetBookList) => request({
  method: 'get',
  url: `/book/getBookList`,
  params: query,
});