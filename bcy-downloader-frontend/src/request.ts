import axios, { AxiosRequestConfig } from "axios";

// const devBaseUrl = "http://localhost:5174"; // fe dev server host
const devBaseUrl = "http://117.175.183.14:46065/"; // fe dev server host
const prodBaseUrl = "http://117.175.183.14:46065/"; // server host

//判断是不是开发环境，如果是开发环境，请求会发到5173端口然后转发到3000端口，详情见vite.config.ts
const baseURL = import.meta.env.PROD ? prodBaseUrl : devBaseUrl;

type RequestBody = {
  [key: string | number]:
    | string
    | number
    | boolean
    | RequestBody
    | (string | number | boolean | RequestBody)[];
};

const _request = axios.create({
  baseURL,
});

export const request = {
  get: <T>(
    url: string,
    params: Record<string, string>,
    options?: AxiosRequestConfig
  ) => {
    return _request.get<T>(url, {
      params,
      ...options,
      withCredentials: true,
    });
  },
  post: <T>(url: string, data: RequestBody, options?: AxiosRequestConfig) => {
    return _request.post<T>(url, data, { ...options, withCredentials: true });
  },
  put: <T>(url: string, data: RequestBody, options?: AxiosRequestConfig) => {
    return _request.put<T>(url, data, { ...options, withCredentials: true });
  },
};
