
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Cart from './components/Cart';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register'
import OrderList from './components/OrderList'
import ProfilePage from './components/ProfilePage';
import MyNav from './components/Navbar';
import ProductListAdmin from './components/ProductListAdmin';
import OrderListAdmin from './components/OrderListAdmin';
import MemberListAdmin from './components/MemberListAdmin';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
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
  }, []);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
    setCartCount(newCartCount);
  }, []);


  return (
    <div>
      {/* <PaymentPage></PaymentPage> */}
      {userId && userId.role === 1 && (
        <Row>
          <Col sm={2}>
            <Navbar expand="lg" variant="dark" bg="dark" style={{ height: "100vh", display: "flex", alignItems: "flex-start", position: "fixed", zIndex: "1000" }}>
              <Container>
                <Col className="sidebar-nav">
                  <Row>
                    <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
                  </Row>
                  <Row>
                    <Nav className="flex-column">
                      <Nav.Link href="/admin/products" style={{ color: "white" }}>Products</Nav.Link>
                      <Nav.Link href="/admin/members" style={{ color: "white" }}>Members</Nav.Link>
                      <Nav.Link href="/admin/orders" style={{ color: "white" }}>Orders</Nav.Link>
                    </Nav>
                  </Row>
                </Col>
              </Container>
            </Navbar>

          </Col>
          <Col m={10}>
            <Router>
              <MyNav cartCount={cartCount} setCartCount={setCartCount}></MyNav>

              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                <Route path="/" element={
                  <Home />
                } />
                <Route path="/home" element={
                  <Home />
                } />
                <Route path="/profile" element={
                  <ProfilePage />
                } />
                <Route path="/cart" element={
                  <Cart />
                } />
                <Route path="/orders" element={
                  <OrderList />
                } />
                <Route path="/admin/" element={
                  <PrivateRoute allowedRoles={[1]}>
                    <ProductListAdmin />
                  </PrivateRoute>
                } />
                <Route path="/admin/products" element={
                  <PrivateRoute allowedRoles={[1]}>
                    <ProductListAdmin />
                  </PrivateRoute>
                } />
                <Route path="/admin/members" element={
                  <PrivateRoute allowedRoles={[1]}>
                    <MemberListAdmin />
                  </PrivateRoute>
                } />
                <Route path="/admin/orders" element={
                  <PrivateRoute allowedRoles={[1]}>
                    <OrderListAdmin />
                  </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </Router>
          </Col>
        </Row>

      )}
      {userId && userId.role !== 1 || userId === null && (
        <Router>
          <MyNav cartCount={cartCount} setCartCount={setCartCount}></MyNav>

          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            <Route path="/" element={
              <PrivateRoute allowedRoles={[2]}>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/home" element={
              <Home />
            } />
            <Route path="/profile" element={
              <ProfilePage />
            } />
            <Route path="/cart" element={
              <Cart />
            } />
            <Route path="/orders" element={
              <OrderList />
            } />
            <Route path="/admin/" element={
              <PrivateRoute allowedRoles={[1]}>
                <ProductListAdmin />
              </PrivateRoute>
            } />
            <Route path="/admin/products" element={
              <PrivateRoute allowedRoles={[1]}>
                <ProductListAdmin />
              </PrivateRoute>
            } />
            <Route path="/admin/members" element={
              <PrivateRoute allowedRoles={[1]}>
                <MemberListAdmin />
              </PrivateRoute>
            } />
            <Route path="/admin/orders" element={
              <PrivateRoute allowedRoles={[1]}>
                <OrderListAdmin />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>)}

    </div>

  );
}

export default App;
