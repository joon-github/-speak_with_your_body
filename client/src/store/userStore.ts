import { atom } from 'recoil';
import { UserResponseData } from '../hooks/useAxios';

export const userInfoState = atom<UserResponseData | null>({
  key: 'userInfo',
  default: null,
});
