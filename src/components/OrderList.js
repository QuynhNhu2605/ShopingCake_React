import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Table, Form } from 'react-bootstrap';
import Layout from './Layout';
import Navbar from './Navbar';
function OrderList({ }) {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const userId = useParams();
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
        setCartCount(newCartCount);
    }, []);
    useEffect(() => {
        if (userId.id) {
            axios.get(`http://localhost:9999/users/${userId.id}`)
                .then(response => {
                    // Tính tổng số lượng của các sản phẩm trong giỏ hàng
                    const totalQuantity = response.data.cart.reduce((total, item) => total + item.quantity, 0);
                    localStorage.setItem('cartCount', totalQuantity);
                    setCartCount(totalQuantity);
                })
                .catch(error => console.error('Error fetching user data:', error));
            const fetchOrders = async () => {
                try {
                    const responseOrders = await axios.get(`http://localhost:9999/orders?userId=${userId.id}`);
                    const responseProducts = await axios.get(`http://localhost:9999/products`);
                    setOrders(responseOrders.data);
                    setProducts(responseProducts.data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            };

            fetchOrders();
        } else {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
            setCartCount(newCartCount);
        }

    }, [userId]);

    return (
        <Container fluid>
            <Navbar cartCount={cartCount} userId={userId.id} setCartCount={setCartCount}></Navbar>
            <Layout userId={userId.id}></Layout>
            <h2>Order History</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order Date</th>
                        <th>Require Date</th>
                        <th>Status</th>
                        <th>Address</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Products</th>
                        <th>VAT-Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.requireDate}</td>
                            <td>{order.status}</td>
                            <td>{order.address}</td>
                            <td>{order.mobile}</td>
                            <td>{order.email}</td>
                            <td>
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product.productId}>
                                            {products && (products.find(p => p.productId === product.productId))?.name} - {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                {order.vat}%-{order.price}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default OrderList;
