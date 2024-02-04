import { atom } from 'recoil';
import { Socket } from 'socket.io-client';

export const socketState = atom<Socket | null>({
  key: 'socketState', // 고유 ID
  default: null, // 기본값은 null
});
