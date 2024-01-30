import axios from 'axios';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
const useLoginMutation = () => {
  const navigate = useNavigate();
  return useMutation(
    (data: { id: string; password: string }) => {
      return axios.post('/auth/login', data);
    },
    {
      onSuccess: () => {
        navigate('/');
      },
    },
  );
};

export default useLoginMutation;
