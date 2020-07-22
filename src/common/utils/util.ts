import { message } from 'antd';

import { AxiosResponse } from 'axios';
import { RESPONSE_DATA } from '../api.interface';
import { Books } from 'container/Platform/Platform';

export enum HTTP_STATUS_CODE {
  SUCCESS = 200,
  PAGE_NOT_FOUNT = 404,
  INTERNAL_ERROR = 500
};

export enum STATUS_CODE {
  SUCCESS = 1000,
  COMMON_ERROR = 1001,
  NOT_LOGIN = 1002,
  PERMISSION_DENIED = 1003
};

interface IProps {
  [key: string]: any;
}

/**
 * 统一的错误处理
 * @param fetchMethod 需要处理的函数，此方法应当需要返回一个 Promise
 * @param props fetchMethod 的参数
 * @param errMsg 当失败后 message 展示的文案，默认是 e
 */
export const errHandling = (
  fetchMethod: (props: IProps) => Promise<AxiosResponse<RESPONSE_DATA>> | Promise<AxiosResponse<RESPONSE_DATA>>,
  props?: IProps,
  errMsg?: string
): Promise<unknown> => {
  return new Promise((resolve, reject) =>
    fetchMethod(props || {}).then(
      value => {
        if (value.status !== HTTP_STATUS_CODE.SUCCESS) {
          message.error(value.data);
          console.error(value);
          reject();
          return;
        }
        const { status_code, e } = value.data;
        switch (status_code) {
          case STATUS_CODE.NOT_LOGIN:
            message.error('Not Login');
            reject(value.data);
            break;
          case STATUS_CODE.SUCCESS:
            resolve(value.data.data);
            break;
          case STATUS_CODE.COMMON_ERROR:
          case STATUS_CODE.PERMISSION_DENIED:
          default:
            message.error(errMsg || JSON.stringify(e));
            console.log(e);
            reject(errMsg || e);
            break;
        }
      },
      reason => {
        message.error(reason);
        reject(reason);
      }
    )
  );
}

/**
 * 防抖
 * @param func 需要防抖的函数
 * @param wait 防抖时间
 * @param immediate 是否在【首次调用】时，立即执行
 */
export function debounce(func: Function, wait: number, immediate: boolean = false) {
  let timeout: NodeJS.Timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * 获取图书名称
 * 
 * @param {Books} book 书籍 or address
 */
export function getBookTitle(book: Books, includeNumber?: boolean): string {
  if (!book) {
    return '';
  }
  if (includeNumber) {
    return book.address.split(/煤矿通用知识教材\/(\d+.*)\/.*/)[1].split('\/')[0];
  }
  return book.address.split(/煤矿通用知识教材\/\d+(.*)\/.*/)[1].split('\/')[0];
}