import React from 'react';
import { Button } from 'antd';
import './App.css';
import jwtDecode from "jwt-decode";
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Div100vh from 'react-div-100vh';

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  const decodedToken = jwtDecode(token);
  const bufferTime = 40 * 60; // time that the client can sit idle in s
  return !(decodedToken.exp * 1000 <= Date.now() + bufferTime * 1000 || !token);
}

const App = () => (
  <div className="App">
    <Div100vh>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Div100vh>
  </div>
);

export default App;