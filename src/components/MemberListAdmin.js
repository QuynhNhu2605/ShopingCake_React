import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const MemberListAdmin = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [cartDetail, setCartDetail] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedGender, setSelectedGender] = useState("");

    useEffect(() => {
        axios.get('http://localhost:9999/users')
            .then(response => {
                setMembers(response.data);
            })
            .catch(error => console.error('Error fetching members:', error));
    }, []);

    const handleShowModal = (cart) => {
        setCartDetail(cart);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const filteredMembers = members.filter(member => {
        const nameMatched = member.name.toLowerCase().includes(searchTerm.toLowerCase());
        const addressMatched = member.address && member.address.toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatched = selectedRole === "" || member.role.toString() === selectedRole;
        const genderMatched = selectedGender === "" || (member.gender === true && selectedGender === "male") || (member.gender === false && selectedGender === "female");
        return (nameMatched || addressMatched) && roleMatched && genderMatched;
    });

    return (
        <div>
            <h3>Member List</h3>
            <div className="d-flex justify-content-between mb-3">
                <input style={{ marginRight: "20px" }}
                    type="text"
                    placeholder="Search by name or address"
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select style={{ marginRight: "20px" }}
                    className="form-control"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="1">Admin</option>
                    <option value="2">Member</option>
                </select>
                <select
                    className="form-control"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map(member => (
                        <tr key={member.id}>
                            <td>{member.id}</td>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.password}</td>
                            <td>{member.dob}</td>
                            <td>{member.gender ? 'Male' : 'Female'}</td>
                            <td>{member.address}</td>
                            <td>{member.role === 1 ? 'Admin' : 'Member'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cart Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {cartDetail.map(item => (
                            <li key={item.productId}>
                                Product ID: {item.productId}, Quantity: {item.quantity}
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MemberListAdmin;
