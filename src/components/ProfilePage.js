import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Form, Button, Container } from 'react-bootstrap';
import Navbar from './Navbar';
function ProfilePage() {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [newUserInfo, setNewUserInfo] = useState({
        name: '',
        email: '',
        dob: '',
        gender: true, // Mặc định giới tính là nam
        address: '',
        mobile: '',
        role: 2,
        cart: []
    });
    const userId = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
        setCartCount(newCartCount);
    }, []);
    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:9999/users/${userId.id}`)
                .then(response => {
                    // Tính tổng số lượng của các sản phẩm trong giỏ hàng
                    const totalQuantity = response.data.cart.reduce((total, item) => total + item.quantity, 0);
                    localStorage.setItem('cartCount', totalQuantity);
                    setCartCount(totalQuantity);
                })
                .catch(error => console.error('Error fetching user data:', error));
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://localhost:9999/users/${userId.id}`);
                    setUser(response.data);
                    console.log(userId)
                    // Cập nhật newUserInfo với dữ liệu từ user
                    setNewUserInfo({
                        id: response.data.id,
                        name: response.data.name,
                        email: response.data.email,
                        password: response.data.password,
                        dob: response.data.dob,
                        gender: response.data.gender,
                        address: response.data.address,
                        mobile: response.data.mobile,
                        role: response.data.role,
                        cart: response.data.cart,
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        } else {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
            setCartCount(newCartCount);
        }

    }, [userId]);
    const handleGenderChange = (e) => {
        const { name, value } = e.target;
        setNewUserInfo(prevState => ({
            ...prevState,
            [name]: value === 'true'
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:9999/users/${userId.id}`, newUserInfo);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again later.');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container >
            <Navbar cartCount={cartCount} etCartCount={setCartCount}></Navbar>
            <h2>User Profile</h2>
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control class="form-control form-control-lg" type="text" name="name" value={newUserInfo.name} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control class="form-control form-control-lg" type="email" name="email" value={newUserInfo.email} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formDOB">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control class="form-control form-control-lg" type="date" name="dob" value={newUserInfo.dob} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Check
                        type="radio"
                        label="Male"
                        name="gender"
                        id="male"
                        value="true"
                        checked={newUserInfo.gender === true}
                        onChange={handleGenderChange}
                    />
                    <Form.Check
                        type="radio"
                        label="Female"
                        name="gender"
                        id="female"
                        value="false"
                        checked={newUserInfo.gender === false}
                        onChange={handleGenderChange}
                    />
                </Form.Group>

                <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control class="form-control form-control-lg" type="text" name="address" value={newUserInfo.address} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formMobile">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control class="form-control form-control-lg" type="text" name="mobile" value={newUserInfo.mobile} onChange={handleChange} />
                </Form.Group>

                <Button variant="success" style={{ marginTop: "10px" }} onClick={handleUpdate}>
                    Update Profile
                </Button>
            </Form>
        </Container>
    );
}

export default ProfilePage;
