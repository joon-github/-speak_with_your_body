import axios from 'axios';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
const navigate = useNavigate();

const useLogoutMutation = () => {
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
