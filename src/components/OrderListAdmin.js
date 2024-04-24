import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Row, Col } from "react-bootstrap";

const OrderListAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [orderDateFilter, setOrderDateFilter] = useState("");
    const [requireDateFilter, setRequireDateFilter] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:9999/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            let orderchange
            // Update the status in the orders array
            const updatedOrders = orders.map(order => {
                if (order.id === orderId) {
                    orderchange = order;
                    return { ...order, status: newStatus };
                }
                return order;
            });

            setOrders(updatedOrders);
            console.log(updatedOrders)
            await axios.put(`http://localhost:9999/orders/${orderId}`, { ...orderchange, status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const emailMatches = order.email.toLowerCase().includes(searchTerm.toLowerCase());
        const addressMatches = order.address.toLowerCase().includes(searchTerm.toLowerCase());

        return (
            (emailMatches || addressMatches) &&
            (statusFilter === "" || order.status === statusFilter) &&
            (orderDateFilter === "" || order.orderDate === orderDateFilter) &&
            (requireDateFilter === "" || order.requireDate === requireDateFilter)
        );
    });

    return (
        <div className="container">
            <h2>Order List</h2>
            <Row className="mb-3">
                <Col md={3}>
                    <Form.Control
                        type="text"
                        placeholder="Search by email or address"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Control
                        as="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Chờ lấy hàng">Chờ lấy hàng</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Đã giao">Đã giao</option>
                    </Form.Control>
                </Col>
                <Col md={3} style={{ display: "flex" }}>
                    <label>Order Date</label>
                    <Form.Control
                        type="date"
                        placeholder="Order Date"
                        value={orderDateFilter}
                        onChange={(e) => setOrderDateFilter(e.target.value)}
                    />
                </Col>
                <Col md={3} style={{ display: "flex" }}>
                    <label>Require Date</label>
                    <Form.Control
                        type="date"
                        placeholder="Require Date"
                        value={requireDateFilter}
                        onChange={(e) => setRequireDateFilter(e.target.value)}
                    />
                </Col>
            </Row>
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
                        <th>VAT</th>
                        <th>Price</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.requireDate}</td>
                            <td>
                                <Form.Control
                                    as="select"
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="Chờ lấy hàng">Chờ lấy hàng</option>
                                    <option value="Đang giao">Đang giao</option>
                                    <option value="Đã giao">Đã giao</option>
                                </Form.Control>
                            </td>
                            <td>{order.address}</td>
                            <td>{order.mobile}</td>
                            <td>{order.email}</td>
                            <td>{order.vat}</td>
                            <td>{order.price}</td>
                            <td>
                                <ul>
                                    {order.products.map((product) => (
                                        <li key={product.productId}>
                                            {product.productId} - Quantity: {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default OrderListAdmin;
