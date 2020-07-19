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

const request: (params: AxiosRequest) => Promise<AxiosResponse<I.RESPONSE_DATA>> = (params) =>
  axios({
    method: params.method,
    url: params.url,
    params: params.params || {},
    data: params.data || {}
  });

const prefix = '/api';

// PING
export const PING = () => request({
  method: 'get',
  url: `${prefix}/ping`,
});