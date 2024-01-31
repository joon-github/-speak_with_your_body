import axios, { AxiosError } from 'axios';
import { message } from 'antd';
type ErrorHandler = (error: AxiosError) => Promise<void> | void;
const axiosSetting = () => {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL =
    location.origin === 'http://localhost:3000'
      ? 'http://localhost:8000'
      : location.origin;

  axios.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return error;
    },
  );

  const handle401Error = async () => {
    window.location.href = '/login';
  };

  const handle402Error: ErrorHandler = async (error) => {
    try {
      const res = await axios.post('/auth/accessToken');
      if (res?.status === 200 && error.config) {
        return axios.request(error.config);
      }
    } catch (e) {
      window.location.href = '/login';
      throw e;
    }
  };

  const errorHandlers: { [key: number]: ErrorHandler } = {
    401: handle401Error,
    402: handle402Error,
  };

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const status = error.response?.status;
      if (axios.isAxiosError(error) && status) {
        const handler = errorHandlers[status];
        return handler(error);
      } else {
        message.error(
          error.response.data.message || '서버에 문제가 생겼습니다.',
        );
      }

      return Promise.reject(error);
    },
  );
};

export default axiosSetting;
