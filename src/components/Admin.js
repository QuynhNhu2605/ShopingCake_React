import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import ProductListAdmin from './ProductListAdmin';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MyNav from './Navbar';
const Admin = ({ }) => {
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState();
    const userId = JSON.parse(localStorage.getItem('user'))
    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log()
        if (userId) {
            axios.get(`http://localhost:9999/users/${userId.id}`)
                .then(response => {
                    setUser(response.data);
                    // Tính tổng số lượng của các sản phẩm trong giỏ hàng
                    const totalQuantity = response.data.cart.reduce((total, item) => total + item.quantity, 0);
                    localStorage.setItem('cartCount', totalQuantity);
                    setCartCount(totalQuantity);
                })
                .catch(error => console.error('Error fetching user data:', error));
        } else {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
            setCartCount(newCartCount);
        }
    }, [cartCount, userId]);
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
        setCartCount(newCartCount);
    }, []);
    useEffect(() => {
        axios.get('http://localhost:9999/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);
    return (
        <div class="admin-dashboard">
            {/* Main content */}

        </div >
    );
};

export default Admin;
