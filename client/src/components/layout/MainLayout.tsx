import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import ErrorBoundary from '../ErrorBoundary';
import PageTransitionProvider from './PageTransitionProvider';

const MainLayout = () => {
  return (
    <MainLayoutContainer>
      <main>
        <ErrorBoundary>
          <PageTransitionProvider>
            <Outlet />
          </PageTransitionProvider>
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
