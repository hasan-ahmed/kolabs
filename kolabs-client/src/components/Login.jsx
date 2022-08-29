import { Card, Form, Button, Input, Spin, notification } from "antd";
import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "../util/APIUtils";
import "./Login.css";
import { AuthContext } from "../Auth";
import jwtDecode from "jwt-decode";
const Login = () => {
    const [loading, setLoading] = useState(false);
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    let navigate = useNavigate();

    const onFinish = (values) => {
        setLoading(true);
        login(values.email, values.password)
            .then(res => {
                localStorage.setItem("token", res.data.token);
                const decodedToken = jwtDecode(res.data.token);
                localStorage.setItem("user", decodedToken.sub);
                localStorage.setItem("userType", decodedToken.userType);
                setAuthenticated(true);
                navigate('/board', { replace: true })
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                if (error.message) {
                    const args = {
                            message: 'Log In Failed!',
                            description: error.response.data.message,
                            duration: 3,
                            type: 'error',
                            placement: 'topRight'
                        };
                        notification.open(args);

                }
            })
        console.log('Success:', values);
    };
    return (
        <Card>
            <Spin spinning={loading}>
                <Form
                    name="login"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Email"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                        Log in
                        </Button>
                    </Form.Item>

                </Form>
            </Spin>
        </Card>
    )
}

export default Login;