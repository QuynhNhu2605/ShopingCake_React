import React, { useEffect, useState } from 'react';
import { Button, Container, Table, Form } from 'react-bootstrap';
import Navbar from './Navbar';
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from 'axios';
function Cart({ }) {
    const [showForm, setShowForm] = useState(false);
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [totalPrice, setTotalPrice] = useState();


    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState([]);
    const userId = useParams()
    const navigate = useNavigate();
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((count, item) => count + item.quantity, 0));
    }, []);
    useEffect(() => {
        if (userId.id !== "undefined") {
            axios.get(`http://localhost:9999/users/${userId.id}`)
                .then(response => {
                    const totalQuantity = response.data.cart.reduce((total, item) => total + item.quantity, 0);
                    setCartCount(totalQuantity);
                    setCart(response.data.cart);
                })
                .catch(error => console.error('Error fetching user data:', error));
        } else {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalQuantity = storedCart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalQuantity);
            setCartItems(storedCart);
        }
    }, [cartCount, userId]);
    useEffect(() => {
        axios.get('http://localhost:9999/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching products:', error));
        if (userId.id !== "undefined") {
            axios.get(`http://localhost:9999/users/${userId.id}`)
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => console.error('Error fetching products:', error));
        }

    }, [cartCount]);
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    useEffect(() => {
        let updatedCart;
        if (userId.id !== "undefined") {
            updatedCart = user.cart;
        } else {
            updatedCart = storedCart;
        }

        // Make sure updatedCart is defined before trying to calculate totalPrice
        if (updatedCart && updatedCart.length > 0) {
            // Tính tổng giá trị của giỏ hàng
            let totalPrice = 0;
            updatedCart.forEach(item => {
                const product = products.find(p => p.productId === item.productId);
                if (product) {
                    totalPrice += product.price * item.quantity;
                }
            });
            setTotalPrice(totalPrice);
        }
    }, [user, storedCart]);
    const updateVAT = (updatedCart) => {
        let totalPrice = 0;
        if (userId.id !== "undefined") {
            // Tính tổng số tiền cho giỏ hàng mới
            totalPrice = updatedCart.reduce((total, item) => {
                const product = products.find(p => p.productId === item.productId);
                if (product) {
                    return total + (product.price * item.quantity);
                }
                return total;
            }, 0);
        }
        else {
            // Tính tổng số tiền cho giỏ hàng mới
            totalPrice = updatedCart.reduce((total, item) => {
                const product = products.find(p => p.productId === item.productId);
                if (product) {
                    return total + (product.price * item.quantity);
                }
                return total;
            }, 0);
        }
        // Cập nhật tổng số tiền
        setTotalPrice(totalPrice);
    };

    const updateQuantity = async (productId, quantityChange) => {

        if (userId.id !== "undefined") {
            let updatedCart;
            updatedCart = user.cart.map(item =>
                item.productId === productId ? { ...item, quantity: Math.max(1, quantityChange) } : item)
            updateVAT(updatedCart)
            await fetch(`http://localhost:9999/users/${userId.id}`, {
                method: 'Put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...user, cart: updatedCart }),
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
        }
        else {
            const updatedCart = cartItems.map(item =>
                item.productId === productId ? { ...item, quantity: Math.max(1, quantityChange) } : item
            );
            updateVAT(updatedCart)
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            updateCartCount(updatedCart);
        }

    };

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = () => {
        const items = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(items);
        updateCartCount(items);
    };

    const updateCartCount = (items) => {
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
    };

    const removeItem = (productId) => {
        if (userId.id !== "undefined") {
            // Tìm index của sản phẩm cần xóa trong giỏ hàng của người dùng
            const index = user.cart.findIndex(item => item.productId === productId);
            // Xóa sản phẩm khỏi giỏ hàng của người dùng
            const updatedCart = [...user.cart.slice(0, index), ...user.cart.slice(index + 1)];
            // Gửi yêu cầu PUT để cập nhật giỏ hàng trên máy chủ
            axios.put(`http://localhost:9999/users/${userId.id}`, {
                ...user,
                cart: updatedCart
            })
                .then(response => {
                    // Nếu cập nhật thành công trên server, cập nhật lại cart trên client
                    setCart(updatedCart);
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
                    updateCartCount(updatedCart);
                })
                .catch(error => console.error('Error updating cart:', error));
        } else {
            // Xóa sản phẩm từ cartItems nếu không có userId
            const updatedCart = cartItems.filter(item => item.productId !== productId);
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            updateCartCount(updatedCart);
        }
    };
    const handleVerifyOrderClick = () => {
        if (cart.length === 0 && cartItems.length === 0) {
            alert("Vui thêm sản phẩm vào giỏ hàng!");
            return;
        }
        else {
            setShowForm(true);

        }
    };
    const verifyOrder = async () => {

        if (!address || !mobile || !email) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        // Ngày giao hàng (3 ngày sau)
        const today = new Date();
        const requireDate = new Date(today);
        requireDate.setDate(requireDate.getDate() + 3);
        const order = {
            userId: userId.id,
            orderDate: today.toISOString(),
            requireDate: requireDate.toISOString(),
            status: "Pending",
            address: address,
            mobile: mobile,
            email: email,
            vat: 8,
            price: totalPrice * 0.08 + totalPrice,
            products: userId.id !== "undefined" ?
                cart.map(item => ({ productId: item.productId, quantity: item.quantity })) :
                cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        };

        try {
            await axios.post('http://localhost:9999/orders', order);
            const updatedCart = userId.id !== "undefined" ?
                user.cart.filter(item => !cart.find(cartItem => cartItem.productId === item.productId)) :
                [];
            await fetch(`http://localhost:9999/users/${userId.id}`, {
                method: 'Put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...user, cart: updatedCart }),
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
            alert("Đặt hàng thành công!");
            navigate(`/cart/${userId.id}`);

        } catch (error) {
            console.error('Error verifying order:', error);
        }
    };
    return (
        <Container>
            <Navbar cartCount={cartCount} userId={userId.id} setCartCount={setCartCount}></Navbar>
            <div className="container mt-5">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng cộng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {cart.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">Giỏ hàng trống</td>
                            </tr>
                        ) : ( */}
                        {userId.id !== "undefined" ? (cart.map((item, index) => (
                            <tr key={index}>
                                <td>{products && (products.find(p => p.productId === item.productId))?.productId}</td>
                                <td>{products && (products.find(p => p.productId === item.productId))?.name}</td>
                                <td>{products && (products.find(p => p.productId === item.productId))?.price}</td>
                                <td>
                                    <Button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
                                    {` ${item.quantity} `}
                                    <Button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                                </td>
                                <td>{products && (products.find(p => p.productId === item.productId))?.price * item.quantity}</td>
                                <td>
                                    <Button variant="danger" onClick={() => removeItem(item.productId)}>Xóa</Button>
                                </td>
                            </tr>
                        ))) : (cartItems.map((item, index) => (
                            <tr key={index}>
                                <td>{products && (products.find(p => p.productId === item.productId))?.productId}</td>
                                <td>{products && (products.find(p => p.productId === item.productId))?.name}</td>
                                <td>{products && (products.find(p => p.productId === item.productId))?.price}</td>
                                <td>
                                    <Button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
                                    {` ${item.quantity} `}
                                    <Button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                                </td>
                                <td>{products && (products.find(p => p.productId === item.productId))?.price * item.quantity}</td>
                                <td>
                                    <Button variant="danger" onClick={() => removeItem(item.productId)}>Xóa</Button>
                                </td>
                            </tr>
                        )))}

                        {/* )} */}
                    </tbody>
                </Table>
            </div>
            <p>VAT: 8%</p>
            <p>Total:{totalPrice === undefined ? 0 : (totalPrice * 0.08 + totalPrice)}</p>
            <Button variant="success" onClick={handleVerifyOrderClick}>Verify Order</Button>
            {showForm && (
                <div className="container mt-3">
                    <Form onSubmit={verifyOrder}>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formMobile">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control type="text" placeholder="Enter mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type='submit'>Order</Button>
                    </Form>
                </div>
            )}
        </Container>

    );
}

export default Cart;
