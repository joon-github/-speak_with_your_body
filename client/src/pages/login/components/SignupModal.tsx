import React from 'react';
import { Form, FormInstance, Input, Modal, message } from 'antd';
import axios from 'axios';

type PropsTyeps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  login: (formData: FormInstance) => void;
};

const SignupModal = ({ open, setOpen, login }: PropsTyeps) => {
  const [form] = Form.useForm();
  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onSubmitSignUp = async () => {
    try {
      const { id, name, password } = await form.validateFields();
      await axios.post('/sign_up', { id, name, password });
      login(form);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const result = e?.response?.data.message;
        message.error(result);
      }
    }
  };

  return (
    <Modal
      title="회원가입"
      open={open}
      okText="가입하기"
      cancelText="닫기"
      onCancel={onCancel}
      onOk={onSubmitSignUp}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="id"
          label={<b>아이디</b>}
          rules={[{ required: true, message: '아이디를 입력하세요.' }]}
        >
          <Input placeholder="아이디" autoComplete="one-time-code" max={20} />
        </Form.Item>
        <Form.Item
          label={<b>이름</b>}
          name="name"
          rules={[
            {
              required: true,
              message: '이름을 입력하세요.',
            },
            {
              pattern: /^[^\s,.]+$/,
              message: '특수문자, 공백, 쉼표, 마침표는 사용할 수 없습니다.',
            },
          ]}
        >
          <Input placeholder="이름" autoComplete="one-time-code" max={20} />
        </Form.Item>
        <Form.Item
          label={<b>비밀번호</b>}
          name="password"
          rules={[
            { required: true, message: '비밀번호를 입력하세요.' },
            { min: 10, message: '비밀번호는 10글자 이상이어야 합니다.' },
            {
              pattern: /[^A-Za-z0-9]/,
              message: '비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.',
            },
          ]}
        >
          <Input.Password
            visibilityToggle={false}
            placeholder="비밀번호"
            autoComplete="one-time-code"
            max={20}
          />
        </Form.Item>
        <Form.Item
          name="passwordCheck"
          label={<b>비밀번호 확인</b>}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '비밀번호 확인을 입력하세요.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('비밀번호가 일치하지 않습니다.'),
                );
              },
            }),
          ]}
        >
          <Input.Password
            visibilityToggle={false}
            placeholder="비밀번호 확인"
            autoComplete="one-time-code"
            max={20}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SignupModal;
