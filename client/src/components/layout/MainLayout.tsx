import { Outlet } from 'react-router-dom';
import { Button } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

const MainLayout = () => {
  const [test, setTest] = useState('test');
  useEffect(() => {
    if (test === 'test') {
      setTest('test2');
    }
  }, [test]);
  return (
    <div>
      <header>header</header>
      <Button
        onClick={() => {
          try {
            axios.post('/test', {
              username: 'test',
              email: 'test',
              password: '123',
            });
          } catch (e) {
            console.log(e);
          }
        }}
      ></Button>
      <main>
        <Outlet
          context={{
            test: 'test',
          }}
        />
      </main>
      <footer>footer</footer>
    </div>
  );
};

export default MainLayout;
