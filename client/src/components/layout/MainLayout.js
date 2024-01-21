import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from 'antd';

const MainLayout = () => {
  const [testState, setTestState] = useState(false);
   // useOutletContex를 받는 컴포넌트는 layout의 상태가 변경되면 모든 children의 컴포넌트가 재실행되어 성능상 좋지 않다.
   // 하지만 프로젝트 규모상 성능이슈가 없으므로 그냥 사용
  return (
    <div>
      <header>header</header>
      <Button onClick={()=>{setTestState(!testState)}}></Button>
      <main>
        <Outlet 
          context={{
            test:"test"
          }} 
        />
      </main>      
      <footer>footer</footer>
    </div>
  );
};

export default MainLayout;