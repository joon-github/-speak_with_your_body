import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import background from '../../assets/image/main.png';
const MainLayout = () => {
  return (
    <MainLayoutContainer>
      <main style={{ backgroundImage: `url(${background})` }}>
        <Outlet />
      </main>
    </MainLayoutContainer>
  );
};

export default MainLayout;

const MainLayoutContainer = styled.div`
  height: 100%;
  main {
    background-size: cover;
    background-repeat: 'no-repeat';
    object-fit: cover;
    height: 100%;
    overflow: hidden;
    width: 100%;
  }
`;
