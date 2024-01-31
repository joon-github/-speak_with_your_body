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
      onSuccess: (res) => {
        if (res.request.status === 401) return;
        navigate('/');
      },
      //실패시
      onError: (error) => {
        console.log(error);
      },
    },
  );
};

export default useLoginMutation;
