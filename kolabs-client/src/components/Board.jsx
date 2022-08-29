import { message, List, Button, Avatar } from 'antd';
import React, { useState, useEffect } from 'react';
import { getFeatureRequests, upvoteFeatureRequest } from '../util/APIUtils';
import { SearchOutlined } from '@ant-design/icons';
import './Board.css';

const Board = ()=> {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getFeatureRequests()
            .then(res => {
                setRequests(res.data)
            })
            .catch(error => {
                if (error.message) {
                    message.error(error.message)
                }

            })
    });

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
                message.error(error.message)
                setLoading(false);
            }

        })
    }
    return (
        <div class="board-container">
            <List
                loading={loading}
                itemLayout='horizontal'
                dataSource={requests}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Button type={item.upvotes.includes(localStorage.getItem("user")) ? "primary" : "dashed"} onClick={() => upvote(item.id)}>👍 {item.upvotes.length} upvotes</Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={"https://joeschmoe.io/api/v1/" + item.id} />}
                            title={item.title}
                            description={<p>{item.description} <br /> <i>Submitted by {item.createdBy}</i></p>}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Board;