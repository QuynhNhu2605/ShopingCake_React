
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import Login from './components/Login';
import Cart from './components/Cart';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register'
import OrderList from './components/OrderList'
import ProfilePage from './components/ProfilePage';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  // const [cartCount, setCartCount] = useState(0);

  // useEffect(() => {
  //   const cart = JSON.parse(localStorage.getItem('cart')) || [];
  //   setCartCount(cart.reduce((count, item) => count + item.quantity, 0));
  // }, []);
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

        <Route path="/home/:id" element={
          <PrivateRoute allowedRoles={[2]}>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/profile/:id" element={
          <PrivateRoute allowedRoles={[2]}>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/cart/:id" element={
          <PrivateRoute allowedRoles={[2]}>
            <Cart />
          </PrivateRoute>
        } />
        <Route path="/orders/:id" element={
          <PrivateRoute allowedRoles={[2]}>
            <OrderList />
          </PrivateRoute>
        } />
        <Route path="/admin/:id" element={
          <PrivateRoute allowedRoles={[1]}>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
