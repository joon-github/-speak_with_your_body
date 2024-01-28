import { message } from 'antd';
import axios from 'axios';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

type UseAxiosType<T = unknown> = {
  method: Method;
  url: string;
  body?: T;
};

const useAxios = async <T>({
  method,
  url,
  body,
}: UseAxiosType<T>): Promise<unknown> => {
  try {
    const config = {
      method: method,
      url: url,
      ...(method === Method.GET || method === Method.DELETE
        ? {}
        : { data: body }),
    };

    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log('e', e);
    if (axios.isAxiosError(e)) {
      const result = e?.response?.data.message || 'An error occurred';
      message.error(result);
    }
    throw e;
  }
};

export default useAxios;
