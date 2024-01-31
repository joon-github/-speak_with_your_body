import { ReactNode } from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
interface IProps {
  children: ReactNode;
}

const TIMEOUT = 150;
type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';
const getTransitionStyles: {
  [key in TransitionStatus | 'unmounted']: React.CSSProperties;
} = {
  entering: {
    position: 'absolute',
    opacity: 0,
  },
  entered: {
    transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
    opacity: 1,
  },
  exiting: {
    transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
    opacity: 0,
  },
  exited: {},
  unmounted: {},
};

const PageTransitionProvider = ({ children }: IProps) => {
  const location = useLocation();
  return (
    <TransitionGroup>
      <Transition
        key={location.pathname}
        timeout={{
          enter: TIMEOUT,
          exit: TIMEOUT,
        }}
      >
        {(status) => <div style={getTransitionStyles[status]}>{children}</div>}
      </Transition>
    </TransitionGroup>
  );
};

export default PageTransitionProvider;
