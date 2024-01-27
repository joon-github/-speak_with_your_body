import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
// import background from '../../assets/image/main.png';
const MainLayout = () => {
  return (
    <MainLayoutContainer>
      <main>
        <Outlet />
      </main>
    </MainLayoutContainer>
  );
};

export default MainLayout;

const MainLayoutContainer = styled.div`
  height: 100%;
  main {
    height: 100%;
    width: 100%;
  }
`;
