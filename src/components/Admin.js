import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import ProductListAdmin from './ProductListAdmin';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Admin = ({ }) => {
    const [products, setProducts] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        // Lấy dữ liệu products từ API
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div class="admin-dashboard">
            {/* Sidebar */}
            <div class="sidebar">
                <Row style={{ margin: "20px 5px" }}>
                    <Col>
                        <h3>Welcome User</h3>
                    </Col>
                    <Col style={{ display: "flex", justifyContent: "end" }}>
                        <Button variant="primary" size="lg" class="logout-btn">Logout</Button>
                    </Col>
                </Row>

            </div>

            {/* Main content */}
            <Container fluid>
                <Row style={{ height: "100hv" }}>
                    <Col sm={2} >
                        {/* Navbar */}
                        <Navbar expand="lg" variant="dark" bg="dark" style={{ height: "100hv", display: "flex", alignItems: "flex-start" }}>
                            <Container >
                                <Col class="sidebar-nav">
                                    <Row>
                                        <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
                                    </Row>
                                    <Row>
                                        <Nav class="flex-column">
                                            <Nav.Link href="#category" style={{ color: "white" }}>Category</Nav.Link>
                                            <Nav.Link href="#product" style={{ color: "white" }}>Product</Nav.Link>
                                            <Nav.Link href="#members" style={{ color: "white" }}>Members</Nav.Link>
                                        </Nav>
                                    </Row>
                                </Col>

                            </Container>
                        </Navbar>
                    </Col>
                    <Col>
                        <ProductListAdmin products={products} ></ProductListAdmin>
                    </Col>
                </Row>



            </Container>
        </div>
    );
};

export default Admin;
