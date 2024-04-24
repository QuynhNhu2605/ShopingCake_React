import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from 'axios';
import ProductItem from './ProductItem';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import Layout from './Layout';
function Home({ }) {
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
    }, [cartCount, userId]);
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const newCartCount = storedCart.reduce((count, item) => count + item.quantity, 0);
        setCartCount(newCartCount);
    }, []);
    useEffect(() => {
        axios.get('http://localhost:9999/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <Container fluid>
            <Layout ></Layout>
            <div className="">
                <div className="row justify-content-center" >
                    {products.map(product => (
                        <ProductItem key={product.id} product={product} setCartCount={setCartCount} user={user} setUser={setUser} />
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item">
                            <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span class="sr-only">Previous</span>
                            </a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item">
                            <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span class="sr-only">Next</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </Container>

    );
}

export default Home;
