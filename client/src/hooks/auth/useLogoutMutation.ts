import axios from 'axios';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';

const useLogoutMutation = () => {
  const navigate = useNavigate();
  return useMutation(
    () => {
      return axios.post('/auth/logout');
    },
    {
      onSuccess: () => {
        navigate('/login');
      },
    },
  );
};

export default useLogoutMutation;
