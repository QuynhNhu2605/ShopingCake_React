import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table, Form } from 'react-bootstrap';
function LogoutLoginButton({ userId, setCartCount }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log(userId)
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        // Chuyển hướng người dùng về trang đăng nhập
        navigate('/home/undefined');
        window.location.reload();

    };
    const handleLogin = () => {
        navigate('/login');

    };

    return (
        <div>
            {userId !== "undefined" ? (<Button variant="success" onClick={handleLogout}>Logout</Button>) : (<Button variant="success" onClick={handleLogin}>Login</Button>)}
        </div>

    );
}
export default LogoutLoginButton;
