import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./NavigationBar";
import ProductCarousel from "./ProductCarousel";
import { Navbar, Nav, Row, Col } from "react-bootstrap";
function Layout({ userId }) {
    const [products, setProducts] = useState([]);
    useEffect(() => {

        fetch("http://localhost:9999/products")
            .then(res => res.json())
            .then(result => setProducts(result));
    }, []);

    return (
        <div>
            <Row >
                <Col xs={12} sm={3} md={9}>  <ProductCarousel products={products} ></ProductCarousel></Col>
                <Col xs={12} sm={9} md={3}><Row>
                    <h3>Hot news</h3></Row>
                    <Row>
                        <Navbar bg="light" expand="lg">
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse>
                                <Nav >
                                    <ul>
                                        <li><a href="#">New 1</a></li>
                                        <li><a href="#">New 2</a></li>
                                        <li><a href="#">New 3</a></li>
                                    </ul>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </Row></Col>
            </Row>

            {/* 3.	Develop a navigation bar using React-Bootstrap to switch between different product categories. */}
            <NavigationBar userId={userId}
                menus={[
                    "Home",
                    "Products",
                    "Orders",
                    "Content",
                ]}
            />
        </div>
    );
}

export default Layout;
