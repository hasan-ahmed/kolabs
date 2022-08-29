import axios from 'axios';
const BASE_URL = "https://v0yttgfcw4.execute-api.us-east-2.amazonaws.com/dev";

export function login(email, password) {
    return axios.post(
        `${BASE_URL}/users/logIn`,
        {email: email, password: password},
        { headers: { 'Content-Type': 'application/json' } }
    )
}

export function getFeatureRequests() {
    return axios.get(
        `${BASE_URL}/featureRequest`,
        { headers: { 
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') 
        } }
    )
}