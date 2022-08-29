import axios from 'axios';
const BASE_URL = "https://v0yttgfcw4.execute-api.us-east-2.amazonaws.com/dev";

export function login(email, password) {
    return axios.post(
        `${BASE_URL}/users/logIn`,
        {email: email, password: password},
        { headers: { 'Content-Type': 'application/json' } }
    )
}

export function signUp(email, password, userType, companyName) {
    let payload = { email: email, password: password, userType: userType };
    if (companyName != null) {
        payload["companyName"] = companyName
    }
    return axios.post(
        `${BASE_URL}/users/signUp`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
    )
}

export function addUserToCompany(userEmail) {
    return axios.post(
        `${BASE_URL}/company/user`,
        {userEmail: userEmail},
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
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

export function upvoteFeatureRequest(requestId) {
    return axios.post(
        `${BASE_URL}/featureRequest/upvote`,
        {id: requestId},
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
    )
}

export function createNewFeatureRequest(title, description) {
    return axios.post(
        `${BASE_URL}/featureRequest`,
        { title: title, description: description, companyId: localStorage.getItem('companyId')},
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
    )
}

export function addCommentToRequest(comment, featureId) {
    return axios.post(
        `${BASE_URL}/featureRequest/comment`,
        { id: featureId, comment: comment },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
    )
}

export function updateRequestStatus(status, featureId) {
    return axios.post(
        `${BASE_URL}/featureRequest/status`,
        { id: featureId, status: status },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
    )
}