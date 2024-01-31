import axios from 'axios';
import { message } from 'antd';

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

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status && [401].includes(error.response.status)) {
          window.location.href = '/login';
        }
        // 402: 리프레쉬 토큰 만료, 재발급 필요
        if (error.response?.status && [402].includes(error.response.status)) {
          axios.post('/auth/refreshToken').then((res) => {
            // 새로운 토큰을 발급받았을 경우, 재요청
            if (res.data.status === 204) {
              if (error.config) {
                axios.request(error.config);
              }
            }
          });
        }
        const result =
          error?.response?.data.message || '서버에 문제가 생겼습니다.';
        message.error(result);
      }
      return error;
    },
  );
};

export default axiosSetting;
