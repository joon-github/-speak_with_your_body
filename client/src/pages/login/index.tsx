import { Button, Card, Flex, Form, Input, message } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
import background from '../../assets/image/main.png';
const LoginPage = () => {
  const login = async () => {
    try {
      const { id, password } = form.getFieldsValue();
      const res = await axios.post('/login', { id, password });
      console.log(res);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const result = e?.response?.data.message;
        message.error(result);
      }
    }
  };

  const test = async () => {
    try {
      const res = await axios.get('/user_check');
      console.log(res);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const result = e?.response?.data.message;
        message.error(result);
      }
    }
  };
  const [form] = Form.useForm();
  return (
    <LoginPageContainer style={{ backgroundImage: `url(${background})` }}>
      <Title>몸으로 말해요!</Title>
      <LoginFormContainer>
        <h3>로그인</h3>
        <FormStyle form={form}>
          <Form.Item name="id" required>
            <Input placeholder="아이디" />
          </Form.Item>
          <Form.Item name="password" required>
            <Input.Password visibilityToggle={false} placeholder="비밀번호" />
          </Form.Item>
        </FormStyle>
        <Flex gap="small" justify="center">
          <Button onClick={login}>로그인</Button>
          <Button onClick={test}>회원가입</Button>
        </Flex>
      </LoginFormContainer>
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

const FormStyle = styled(Form)`
  label {
    font-weight: bold;
  }
`;
