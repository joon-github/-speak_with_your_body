import { useEffect } from 'react';
import useAxios, { Method } from './useAxios';
// import { useNavigate } from 'react-router-dom';

const useLoginCheck = () => {
  // const navigate = useNavigate();
  useEffect(() => {
    const loginCheack = async () => {
      try {
        const res = await useAxios({
          method: Method.GET,
          url: '/user_check',
        });
        console.log('res', res);
      } catch (e) {
        console.error('eeeee', e);
      }
    };
    loginCheack();
  }, []);
};

export default useLoginCheck;
