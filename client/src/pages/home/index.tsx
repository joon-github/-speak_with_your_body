import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    console.log('');
    // try {
    //   const res = await axios.get('/user_check');
    //   console.log(res);
    // } catch (e) {
    //   if (axios.isAxiosError(e)) {
    //     const result = e?.response?.data.message;
    //     message.error(result);
    //   }
    // }
  }, []);
  return <div></div>;
};

export default HomePage;
