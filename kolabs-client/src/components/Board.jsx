import { message, List, Button, Avatar, Tag, Col, Form, Input, notification, Popover, Modal, Comment, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { addCommentToRequest, addUserToCompany, createNewFeatureRequest, getFeatureRequests, upvoteFeatureRequest } from '../util/APIUtils';
import { BuildFilled, SearchOutlined } from '@ant-design/icons';
import './Board.css';
import { mapStatusToColor, mapStatusToText } from '../util/Helpers';
import TextArea from 'antd/lib/input/TextArea';
import { useDebugValue } from 'react';

const Board = ()=> {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const [activeCommentSection, setActiveCommentSection] = useState(null);

    useEffect(() => {
        getFeatureRequests()
            .then(res => {
                setRequests(res.data)
            })
            .catch(error => {
                if (error.message) {
                    message.error(error.response.data.message)
                }

            })
    }, []);

    const upvote = (requestId) => {
        setLoading(true);
        upvoteFeatureRequest(requestId)
        .then(res => {
            getFeatureRequests()
                .then(res => {
                    setLoading(false);
                    setRequests(res.data)
                })
        })
        .catch(error => {
            if (error.message) {
                message.error(error.response.data.message)
                setLoading(false);
            }
        })
    }
    const inviteUser = (values) => {
        setLoading(true);
        addUserToCompany(values.userEmail)
        .then(res => {
            const args = {
                message: 'User has been added to your company',
                duration: 5,
                type: 'success',
                placement: 'topRight'
            };
            notification.open(args);
            setLoading(false);
        })
        .catch(error => {
            console.log(error)
            if (error.response) {
                message.error(error.response.data.message)
                setLoading(false);
            }
        })
    }
    const submitNewRequest = (values) => {
        setLoading(true);
        createNewFeatureRequest(values.title, values.description)
        .then(res => {
            const args = {
                message: 'Your request has been submitted!',
                duration: 5,
                type: 'success',
                placement: 'topRight'
            };
            notification.open(args);
            getFeatureRequests()
                .then(res => {
                    setLoading(false);
                    setRequests(res.data)
                })
        })
        .catch(error => {
            if (error.message) {
                message.error(error.response.data.message)
                setLoading(false);
            }
        })
    }

    const submitComment = (values) => {
        setLoading(true);
        console.log(activeCommentSection.id)
        addCommentToRequest(values.comment, activeCommentSection.id)
        .then(res => {
            getFeatureRequests()
                .then(res => {
                    setRequests(res.data)
                    handleCancel();
                    setActiveCommentSection(activeCommentSection);
                    const args = {
                        message: 'Your comment has been submitted',
                        duration: 5,
                        type: 'success',
                        placement: 'topRight'
                    };
                    notification.open(args);
                    setLoading(false);
                })
        })
        .catch(error => {
            if (error.message) {
                message.error(error.response.data.message)
                setLoading(false);
            }
        })
    }

    const showModal = (featureId) => {
        setActiveCommentSection(featureId);
        setIsCommentModalVisible(true);
    };

    const handleOk = () => {
        setIsCommentModalVisible(false);
    };

    const handleCancel = () => {
        setIsCommentModalVisible(false);
        setActiveCommentSection(null);
    };

    const handleStatusChange = (value) => {
        console.log(useDebugValue)
    }

    const buildActions = (item) => {
        let actions = [
            <Popover
                content={item.upvotes}
            >
                <Button type={item.upvotes.includes(localStorage.getItem("user")) ? "primary" : "dashed"} onClick={() => upvote(item.id)}>👍 {item.upvotes.length} upvotes</Button>,
            </Popover>,
            <Button onClick={() => showModal(item)} >💬 {item.comments.length} comments</Button>
        ]
        if (localStorage.getItem("userType") == "COMPANY_MANAGER"){
            
        }
        return actions;
    }
    return (
        <div class="board-container">
            <h1>Feature Board: {localStorage.getItem("companyId")}</h1>
            {localStorage.getItem("userType") == "COMPANY_MANAGER" && 
                <div>
                    <h3>Add user as collaborator</h3>
                    <Form
                        layout='inline'
                        onFinish={inviteUser}
                    >
                        <Form.Item name="userEmail">
                            <Input placeholder='User Email'></Input>
                        </Form.Item> 
                        <Button type="primary" htmlType="submit" loading={loading}>
                                Add User
                        </Button>
                    </Form>
                </div>
            }
            {localStorage.getItem("userType") == "USER" && 
                <div>
                    <h3>Submit a New Request</h3>
                    <Form
                        layout='inline'
                        onFinish={submitNewRequest}
                    >
                        <Form.Item name="title">
                            <Input placeholder='Title'></Input>
                        </Form.Item> 
                        <Form.Item  name="description">
                            <TextArea placeholder='Description'></TextArea>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                                Submit Request
                        </Button>
                    </Form>
                </div>
            }
            <h3>Feature Requests</h3>
            <List
                loading={loading}
                itemLayout='horizontal'
                dataSource={requests}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Popover
                            content={item.upvotes}
                            >
                                <Button type={item.upvotes.includes(localStorage.getItem("user")) ? "primary" : "dashed"} onClick={() => upvote(item.id)}>👍 {item.upvotes.length} upvotes</Button>,
                            </Popover>,
                            <Button onClick={() => showModal(item)} >💬 {item.comments.length} comments</Button>,
                            <>
                                {localStorage.getItem("userType") == "COMPANY_MANAGER" &&
                                    <Select defaultValue={item.status} onChange={handleStatusChange}>
                                        <Select.Option value="NEW">New</Select.Option>
                                        <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
                                        <Select.Option value="COMPLETED">Completed</Select.Option>
                                        <Select.Option value="CLOSED">Closed</Select.Option>
                                    </Select>
                                } 
                            </>

                        ]}
                        extra={[
                            <>
                                {localStorage.getItem("userType") == "USER" &&
                                    <Tag color={mapStatusToColor(item.status)}> {mapStatusToText(item.status)}</Tag>
                                }
                            </>,
                            <>
                                <span>AI Generated Label: <Tag color={"purple"}>{item.aiLabelsSuggestions}</Tag></span>
                            </>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={"https://joeschmoe.io/api/v1/" + item.createBy} />}
                            title={item.title}
                            description={<p>{item.description} <br /> <i>Submitted by {item.createdBy}</i></p>}
                        />
                    </List.Item>
                )}
            />
            <Modal visible={isCommentModalVisible} onCancel={handleCancel}>
                {activeCommentSection != null &&
                    <div>
                        <h4>{activeCommentSection.title}</h4>
                        {activeCommentSection.comments.map((comment, i) => {
                            return <Comment
                                author= {comment.user}
                                avatar={<Avatar src={"https://joeschmoe.io/api/v1/" + comment.createBy} />}
                                content={<p>{comment.comment}</p>}
                            >

                            </Comment>
                        })}
                        <Form onFinish={submitComment}>
                            <Form.Item name="comment">
                                <TextArea placeholder='Comment'/>
                            </Form.Item>
                            <Button loading={loading} type="primary" htmlType="submit">
                                Comment
                        </Button>
                        </Form>
                    </div>
                    
                }
                
            </Modal>
        </div>
    )
}

export default Board;