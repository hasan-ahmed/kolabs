import { Card, Form, Button, Input, Spin, notification, Row, Radio } from "antd";
import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { login, signUp } from "../util/APIUtils";
import "./SignUp.css";
import { AuthContext } from "../Auth";
import jwtDecode from "jwt-decode";
import Logo from "../static/images/Logo.svg";
const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    const [userType, setUserType] = useState(null);
    let navigate = useNavigate();

    const onUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const onFinish = (values) => {
        setLoading(true);
        if (values.userType === "COMPANY_MANAGER" && values.companyName == null) {
            const args = {
                            message: 'Log In Failed!',
                            description: "You must enter a company name",
                            duration: 3,
                            type: 'error',
                            placement: 'topRight'
                        };
                        notification.open(args);
        }
        signUp(values.email, values.password, values.userType, values.companyName)
            .then(res => {
                navigate('/', { replace: true })
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
    const navigateToLogIn = () => {
        navigate('/logIn', { replace: true })
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
                    layout='vertical'
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

                    <Form.Item
                        name="userType"
                        rules={[{ required: true, message: 'Please choose a user type' }]}
                    >
                        <Radio.Group onChange={onUserTypeChange}>
                            <Radio value={"USER"}>User</Radio>
                            <Radio value={"COMPANY_MANAGER"}>Company Manager</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {userType === "COMPANY_MANAGER" &&
                        <Form.Item
                            name="companyName"
                        >
                            <Input placeholder="Company Name"/>
                        </Form.Item>
                    }

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                        Sign Up
                        </Button>
                    </Form.Item>
                </Form>
                <br />
                <span>Already have an account? <a onClick={navigateToLogIn}>Log In!</a></span>
            </Spin>
        </Card>
        </div>
        
    )
}

export default SignUp;