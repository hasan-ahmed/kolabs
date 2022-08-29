import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { getFeatureRequests } from '../util/APIUtils';

const Board = ()=> {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        getFeatureRequests()
            .then(res => {
                console.log(res.data)
            })
            .catch(error => {
                if (error.message) {
                    message.error(error.message)
                }

            })
    });
    return (
        <p>Board!</p>
    )
}

export default Board;