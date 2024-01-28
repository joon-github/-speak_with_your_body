import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Card, Flex, Form, FormInstance, Input } from 'antd';

import background from '../../assets/image/main.png';
import SignUpModal from './components/SignupModal';

import useAxios, { Method } from '../../hooks/useAxios';

const LoginPage = () => {
  const [signupModalOpen, setsSignupModalOpen] = useState(false);
  const navigate = useNavigate();
  const login = async (formData: FormInstance) => {
    const { id, password } = formData.getFieldsValue();
    try {
      await useAxios({
        method: Method.POST,
        url: '/login',
        body: { id, password },
      });
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const onClickSignupBtn = async () => {
    setsSignupModalOpen(true);
  };
  const [form] = Form.useForm();
  return (
    <LoginPageContainer style={{ backgroundImage: `url(${background})` }}>
      <Title>몸으로 말해요!</Title>
      <LoginFormContainer>
        <h3>로그인</h3>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item label={<b>아이디</b>} name="id" required>
            <Input placeholder="아이디" max={20} />
          </Form.Item>
          <Form.Item label={<b>비밀번호</b>} name="password" required>
            <Input.Password
              visibilityToggle={false}
              placeholder="비밀번호"
              max={20}
            />
          </Form.Item>
        </Form>
        <Flex gap="small" justify="center">
          <Button onClick={() => login(form)}>로그인</Button>
          <Button onClick={onClickSignupBtn}>회원가입</Button>
        </Flex>
      </LoginFormContainer>
      <SignUpModal
        open={signupModalOpen}
        setOpen={setsSignupModalOpen}
        login={login}
      />
    </LoginPageContainer>
  );
};

export default LoginPage;

const LoginFormContainer = styled(Card)`
  width: 400px;
  padding: 5px 5px;
  box-shadow: 5px 5px 10px 1px rgba(0, 0, 0, 0.54);
  h3 {
    margin: 0 0 20px 0;
    text-align: center;
  }
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Title = styled.h1`
  font-size: 70px;
  color: #170a61;
  text-align: center;
  z-index: 2;
  font-family: 'SingleDay';
  white-space: nowrap;
  &::before {
    content: '몸으로 말해요!';
    color: #ffffff;
    position: fixed;
    left: 50%;
    transform: translate(-51%, -5%);
    z-index: 0;
  }
  @media (max-width: 768px) {
    font-size: 50px;
  }
`;

const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-bottom: 50px;

  background-size: cover;
  background-repeat: 'no-repeat';
  background-position: center;
  object-fit: cover;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;
