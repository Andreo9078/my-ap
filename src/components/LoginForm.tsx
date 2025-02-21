import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, theme } from "antd";

import { useElectronAPI } from "../hooks/useElectronAPI";
import { useUser } from "../contexts/currentUserContext";

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loginError, setLoginError] = useState<string | null>(null);
  const electronAPI = useElectronAPI();
  const { login } = useUser();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const users = await electronAPI.auth.user.getUsers({
        username: values.username,
        password: values.password,
      });

      if (users.length === 0) {
        setLoginError("Invalid username or password");
        return;
      } else if (users.length === 1) {
        console.log(users[0]);
        login({ ...users[0].dataValues });
      } else {
        console.error("Login error", users);
      }
    } catch (err) {
      setLoginError("Invalid username or password");
      return;
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Form Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: colorBgContainer,
        height: "100vh",
      }}
    >
      <Card
        style={{
          width: 300,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", paddingBottom: "20px" }}>Войти</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Введите имя пользователя!" }]}
          >
            <Input placeholder="Имя пользователя" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>

          {loginError && (
            <div style={{ color: "red", marginBottom: "2px" }}>
              {loginError}
            </div>
          )}

          {/* <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
