import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table, Form } from 'react-bootstrap';
function LogoutLoginButton({ setCartCount }) {
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('user'))

    const handleLogout = () => {
        console.log(userId)
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        // Chuyển hướng người dùng về trang đăng nhập
        navigate('/home');
        window.location.reload();

    };
    const handleLogin = () => {
        navigate('/login');

    };

    return (
        <div>
            {userId !== null ? (<Button variant="success" onClick={handleLogout}>Logout</Button>) : (<Button variant="success" onClick={handleLogin}>Login</Button>)}
        </div>

    );
}
export default LogoutLoginButton;
