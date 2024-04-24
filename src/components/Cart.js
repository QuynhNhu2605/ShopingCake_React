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
    const [paymentUrl, setPaymentUrl] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState([]);
    const userId = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate();
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((count, item) => count + item.quantity, 0));
    }, []);
    useEffect(() => {
        if (userId !== null) {
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
        if (userId !== null) {
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
        if (userId !== null) {
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
        if (userId !== null) {
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

        if (userId !== null) {
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
        if (userId !== null) {
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

        }
        else {
            setShowForm(true);

        }
    };
    const verifyOrder = async () => {
        // Thêm dữ liệu vào cơ sở dữ liệu
        const today = new Date();
        const requireDate = new Date(today);
        requireDate.setDate(requireDate.getDate() + 3);
        const order = {
            userId: userId !== null ? userId.id : Math.random().toString(36).substring(2, 8),
            orderDate: today.toISOString(),
            requireDate: requireDate.toISOString(),
            status: "Pending",
            address: address,
            mobile: mobile,
            email: email,
            vat: 8,
            price: totalPrice * 0.08 + totalPrice,
            products: userId !== null ?
                cart.map(item => ({ productId: item.productId, quantity: item.quantity })) :
                cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        };
        if (!address || !mobile || !email) {
            alert("Vui lòng điền đầy đủ thông tin!");
            setShowForm(true);
        }
        else if (cart.length === 0 && cartItems.length === 0) {
            alert("Vui lòng thêm sản phẩm vào giỏ hàng!");
        }
        else {
            const updatedCart = userId !== null ?
                user.cart.filter(item => !cart.find(cartItem => cartItem.productId === item.productId)) :
                [];
            if (userId !== null) {
                axios.put(`http://localhost:9999/users/${userId.id}`, {
                    ...user,
                    cart: updatedCart
                })
                    .then(() => {
                        localStorage.setItem('cart', JSON.stringify(updatedCart));
                        setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
                        alert("Đặt hàng và thanh toán thành công!");
                        navigate(`/cart`);
                    })
                    .catch(error => console.error('Error updating cart:', error));
            }
            axios.post('http://localhost:9999/orders', order)

                .catch(error => console.error('Error adding order:', error));
        }
        // Thực hiện thanh toán

    };
    const initializePayment = async () => {
        try {
            const response = await axios.post('http://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder', {
                amount: totalPrice * 0.08 + totalPrice,
                orderInfo: 'Thanh toán đơn hàng',
                orderId: 'ORDER_ID_123',
            });

            if (response.data.success) {
                setPaymentUrl(response.data.paymentUrl);
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        }
    }, [paymentUrl]);
    // Xử lý phản hồi từ VNPAY sau khi thanh toán thành công
    useEffect(() => {
        // const params = new URLSearchParams(window.location.search);
        // const isSuccess = params.get('vnp_ResponseCode') === '00'; // Kiểm tra mã phản hồi từ VNPAY

        // if (isSuccess) {

        // }
    }, []);
    const handleVNPay = () => {
        router.post('/cart', function (req, res, next) {
            var ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            // Thông tin cấu hình
            var tmnCode = 'Z1FMHL2N';
            var secretKey = 'RGCDUCNFWHKGAWEFDUMTYUELCTJGNKHH';
            var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
            var returnUrl = 'http://localhost:3000/Cart'; // Thay YOUR_RETURN_URL bằng URL trả về của bạn

            var date = new Date();
            var createDate = dateFormat(date, 'yyyymmddHHmmss');
            var orderId = dateFormat(date, 'HHmmss');
            var amount = 1000000;
            // var bankCode = req.body.bankCode;
            // var orderInfo = req.body.orderDescription;
            // var orderType = req.body.orderType;
            var locale = req.body.language || 'vn'; // Mặc định là 'vn' nếu ngôn ngữ không được cung cấp

            var currCode = 'VND';
            var vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: tmnCode,
                vnp_Locale: locale,
                vnp_CurrCode: currCode,
                vnp_TxnRef: orderId,
                vnp_OrderInfo: orderInfo,
                vnp_OrderType: orderType,
                vnp_Amount: amount * 100,
                vnp_ReturnUrl: returnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: createDate
            };

            // Thêm mã ngân hàng nếu có
            if (bankCode) {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            // Sắp xếp các tham số theo thứ tự tăng dần
            var sortedParams = {};
            Object.keys(vnp_Params).sort().forEach(function (key) {
                sortedParams[key] = vnp_Params[key];
            });

            // Tạo chuỗi dữ liệu để tạo chữ ký bảo mật
            var querystring = require('qs');
            var signData = querystring.stringify(sortedParams, { encode: false });

            // Tạo chữ ký bảo mật
            var crypto = require("crypto");
            var hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

            // Thêm chữ ký bảo mật vào các tham số
            vnp_Params['vnp_SecureHash'] = signed;

            // Tạo URL thanh toán
            var redirectUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

            // Chuyển hướng người dùng đến URL thanh toán
            res.redirect(redirectUrl);
        });
    }


    return (
        <Container>
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
                        {userId !== null ? (cart.map((item, index) => (
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
            <div>
                <Button variant="success" onClick={initializePayment}>Thanh toán qua VNPay</Button>
                {paymentUrl && (
                    <div onClick={handleVNPay}>
                        <p>Click vào link sau để thanh toán:</p>
                        <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                            {paymentUrl}
                        </a>
                    </div>
                )}
            </div>
        </Container>

    );
}

export default Cart;
