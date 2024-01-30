import { useQuery } from 'react-query';
import fetcher from '../../utils/fetcher';

const useUserCheckQuery = () => {
  return useQuery('user_check', () => fetcher('/user_check'));
};

export default useUserCheckQuery;
