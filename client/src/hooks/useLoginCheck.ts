import { useEffect } from 'react';
import useAxios, { Method } from './useAxios';
import { useSetRecoilState } from 'recoil';
import { userInfoState } from '../store/userStore';

const useLoginCheck = () => {
  const setUserInfo = useSetRecoilState(userInfoState);
  useEffect(() => {
    const loginCheack = async () => {
      try {
        const res = await useAxios({
          method: Method.GET,
          url: '/user_check',
        });
        setUserInfo(res.data);
      } catch (e) {
        console.error('eeeee', e);
      }
    };
    loginCheack();
  }, []);
};

export default useLoginCheck;
