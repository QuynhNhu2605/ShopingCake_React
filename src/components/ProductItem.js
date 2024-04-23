import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';
function ProductItem({ product, user, setCartCount, setUser }) {
    const addToCart = async () => {
        let updatedCart;
        if (user) {
            const item = user.cart.find(p => p.productId === product.productId);
            if (item) {
                updatedCart = user.cart.map(item =>
                    item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item)
            } else {
                const newCartItem = { productId: product.productId, quantity: 1 };
                updatedCart = [...user.cart, newCartItem];
            }
            await fetch(`http://localhost:9999/users/${user.id}`, {
                method: 'Put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...user, cart: updatedCart }),
            });
            setUser({ ...user, cart: updatedCart });
        } else {
            const storedCart = localStorage.getItem('cart');
            let updatedItem;
            if (storedCart) {
                const cart = JSON.parse(storedCart);
                const existingItem = cart.find(item => item.productId === product.productId);
                if (existingItem) {
                    updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
                    updatedCart = cart.map(item =>
                        item.productId === updatedItem.productId ? updatedItem : item
                    );
                } else {
                    updatedCart = [...cart, { productId: product.productId, quantity: 1 }];
                }
            } else {
                updatedCart = [{ productId: product.productId, quantity: 1 }];
            }
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        console.log(updatedCart)
        const newCartCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
        setCartCount(newCartCount);
    }
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const newCartCount = cart.reduce((count, item) => count + item.quantity, 0);
        setCartCount(newCartCount);
    };

    return (
        <Card style={{ width: '22rem', marginBottom: '10px', margin: "10px" }}>
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                    Giá: {product.price}
                </Card.Text>
                <Button variant="primary" onClick={addToCart}>Thêm vào giỏ hàng</Button>
            </Card.Body>
        </Card>
    );
}

export default ProductItem;
