import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import ErrorBoundary from '../ErrorBoundary';

const MainLayout = () => {
  return (
    <MainLayoutContainer>
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
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
    padding: 10px 10%;
  }
`;
