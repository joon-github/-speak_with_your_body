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
          console.log(error);
          // window.location.href = '/login';
        }
        if (error.response?.status && [402].includes(error.response.status)) {
          console.log(error);
          axios.post('/auth/accessToken').then((res) => {
            console.log(error);
            console.log('res', res);
            if (res?.status === 200) {
              if (error.config) {
                axios.request(error.config);
              }
            } else {
              // window.location.href = '/login';
            }
          });
        } else {
          const result =
            error?.response?.data.message || '서버에 문제가 생겼습니다.';
          message.error(result);
        }
      }
      return error;
    },
  );
};

export default axiosSetting;
