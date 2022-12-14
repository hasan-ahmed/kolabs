import { Card, Form, Button, Input, Spin, notification, Row } from "antd";
import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "../util/APIUtils";
import "./Login.css";
import { AuthContext } from "../Auth";
import jwtDecode from "jwt-decode";
import Logo from "../static/images/Logo.svg";
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
                localStorage.setItem("companyId", decodedToken.companyId);
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
    const navigateToSignUp = () => {
        navigate('/signUp', { replace: true })
    }
    return (
        <div class="login-card">
            <Card>
            <Row>
                <img
                        src={Logo}
                        alt="Kolabs"
                        className="logo"
                    />

            </Row>
            <Spin spinning={loading}>
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout='inline'
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
                <br />
                <span>Don't have an account? <a onClick={navigateToSignUp}>Sign Up!</a></span>
            </Spin>
        </Card>
        </div>
        
    )
}

export default Login;