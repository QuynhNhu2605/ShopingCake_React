import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Nav, Badge } from 'react-bootstrap';
import LogoutLoginButton from './LogoutLoginButton';
function Navbar({ cartCount, setCartCount }) {
    const userId = JSON.parse(localStorage.getItem('user'))

    return (
        <BootstrapNavbar bg="light" expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to={`/home`}>ShoppingCake</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={`/cart`}>
                            <img src="https://img.favpng.com/22/16/7/shopping-cart-icon-png-favpng-WzFfWAWJe97MmDVjyDJwr5Y69.jpg" alt="Cart" style={{ width: 24, height: 24 }} />
                            {cartCount > 0 && <Badge bg="secondary">{cartCount}</Badge>}
                        </Nav.Link>

                    </Nav>
                </BootstrapNavbar.Collapse>
                {userId !== null ? (<Nav.Link as={Link} to={`/profile`} style={{ marginLeft: "10px", marginRight: "10px" }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" alt="Profile" style={{ width: 30, height: 30 }} />
                </Nav.Link>) : (<div></div>)}

                <LogoutLoginButton setCartCount={setCartCount} />
            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar;
