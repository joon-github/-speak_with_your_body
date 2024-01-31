import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

// ButtonHTMLAttributes를 사용하여 HTML button의 모든 속성을 포함
const CustomButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return <ButtonStyle {...props}>{children}</ButtonStyle>;
};

export default CustomButton;

const ButtonStyle = styled.button`
  // 여기에 원하는 스타일을 추가하세요
  padding: 8px 16px;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: darkblue;
  }
`;
