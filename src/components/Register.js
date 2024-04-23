import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState(true); // true for male, false for female
    const navigate = useNavigate();
    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            if (password !== confirmPassword) {
                alert('Password and Confirm Password must match');
                return;
            }
            const newUser = {
                name,
                email,
                password,
                dob,
                gender,
                role: 2,
                cart: []// Assuming default role for regular users
            };
            await axios.post('http://localhost:9999/users', newUser);
            alert('Sign up successful! Please log in to continue.');
            navigate('/login');
        } catch (error) {
            console.error('Sign up failed:', error);
            alert('Sign up failed, please try again later.');
        }
    };

    return (
        <section className="vh-100" style={{ backgroundColor: "#9A616D", height: "100px" }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ borderRadius: "1rem" }} >
                            <div className="row g-0" style={{ height: "500px" }}>
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                        alt="signup form" className="img-fluid" style={{ borderRadius: "1rem 0 0 1rem", height: "500px" }} />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <div className="d-flex align-items-center mb-3 pb-1">
                                            <i className="fas fa-cubes fa-2x me-3" style={{ color: "#ff6219" }} ></i>
                                            <span className="h1 fw-bold mb-0">SignUp</span>
                                        </div>

                                        <Form onSubmit={handleRegister}>
                                            <Row>
                                                <Col>

                                                    <div className="form-outline ">
                                                        <input type="email" className="form-control form-control-lg"
                                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                                        <label className="form-label" htmlFor="email">Email address</label>
                                                    </div>
                                                    <div className="form-outline ">
                                                        <input type="password" className="form-control form-control-lg"
                                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                                        <label className="form-label" htmlFor="password">Password</label>
                                                    </div>
                                                    <div className="form-outline ">
                                                        <input type="password" className="form-control form-control-lg"
                                                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                                    </div>
                                                    <div className="pt-1 ">
                                                        <button className="btn btn-dark btn-lg btn-block" type="submit">Sign Up</button>
                                                    </div>
                                                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }} >Already have an account? <a href="/login" style={{ color: "#393f81" }} >Login here</a></p>
                                                </Col>
                                                <Col>
                                                    <div className="form-outline ">
                                                        <input type="text" className="form-control form-control-lg"
                                                            value={name} onChange={(e) => setName(e.target.value)} />
                                                        <label className="form-label" htmlFor="name">Full Name</label>
                                                    </div>
                                                    <div className="form-outline">
                                                        <input type="date" className="form-control form-control-lg"
                                                            value={dob} onChange={(e) => setDob(e.target.value)} />
                                                        <label className="form-label" htmlFor="dob">Date of Birth</label>
                                                    </div>
                                                    <div className="">
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" name="gender" id="male" value="male"
                                                                checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
                                                            <label className="form-check-label" htmlFor="male">Male</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" name="gender" id="female" value="female"
                                                                checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
                                                            <label className="form-check-label" htmlFor="female">Female</label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>


                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup;
