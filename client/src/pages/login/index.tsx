import { Button, Card, Flex, Form, Input } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
const LoginPage = () => {
  const login = async () => {
    try {
      const { id, pw } = form.getFieldsValue();
      const res = await axios.post('/login', { id, pw });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    console.log('test', form);
  };
  const [form] = Form.useForm();
  return (
    <LoginPageContainer>
      <Title>몸으로 말해요!</Title>
      <LoginFormContainer>
        <FormStyle form={form}>
          <Form.Item name="id" required>
            <Input placeholder="아이디" />
          </Form.Item>
          <Form.Item name="pw" required>
            <Input.Password visibilityToggle={false} placeholder="비밀번호" />
          </Form.Item>
        </FormStyle>
        <Flex gap="small" justify="center">
          <Button onClick={login}>로그인</Button>
          <Button>회원가입</Button>
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
`;

const Title = styled.h1`
  font-size: 70px;
  color: #170a61;
  text-align: center;
  z-index: 2;
  font-family: 'SingleDay';
  &::before {
    content: '몸으로 말해요!';
    color: #ffffff;
    position: fixed;
    left: 50%;
    transform: translate(-51%, -5%);
    z-index: 0;
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
`;

const FormStyle = styled(Form)`
  label {
    font-weight: bold;
  }
`;
