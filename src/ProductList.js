import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import ProductDetailModal from "./ProductDetailModal";
import ProductEditModal from "./ProductEditModal";
const ProductList = ({ products, carts }) => {
  const [showModal, setShowModal] = useState(false);
  const [productDetail, setProductDetail] = useState([])
  const [cart, setCart] = useState([])
  const [checkDupicate, setCheckDupicate] = useState(0)
  const handleShowModalDetail = (product) => {
    setShowModal(true)
    setProductDetail(product)
  }
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddToCart = (product) => {
    carts.forEach(cart => {
      // console.log(cart.productId)
      // console.log(product.productId)
      if (cart.productId === product.productId) {
        console.log(product.productId)
        const quantityCart = parseInt(cart.quantity) + 1
        console.log(quantityCart)
        fetch(`http://localhost:9999/carts/${cart.cartID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: quantityCart }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            console.log("Cart item updated:", data);
            // Cập nhật lại giỏ hàng
            const updatedCart = carts.map((item) =>
              item.productId === product.productId ? data : item
            );
            setCart(updatedCart);
          })
          .catch((error) => {
            console.error("Error updating cart item:", error);
            // Xử lý lỗi nếu có
          });
        setCheckDupicate(1)
      }

    });
    console.log(checkDupicate)
    // if (checkDupicate === 0) {
    //   console.log(checkDupicate)
    //   fetch("http://localhost:9999/carts", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       productId: product.productId,
    //       quantity: 1, // Số lượng sản phẩm được thêm vào giỏ hàng
    //     }),
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Network response was not ok");
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log("Cart item added:", data);
    //       // Cập nhật lại giỏ hàng sau khi thêm sản phẩm
    //       setCart([...cart, data]);
    //     })
    //     .catch((error) => {
    //       console.error("Error adding item to cart:", error);
    //       // Xử lý lỗi nếu có
    //     });
    // }
  }
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((product, index) => (
          <Card key={index} style={{ width: "21rem", margin: "10px" }}>
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>
                {product.category} - ${product.price}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleShowModalDetail(product)}
              >
                Details
              </Button>
              <Button style={{ marginLeft: "20px" }}
                variant="primary"
                onClick={() => handleAddToCart(product)}
              >
                AddToCart
              </Button>

            </Card.Body>

          </Card>
        ))}

      </div>
      {console.log(productDetail)}
      <ProductDetailModal product={productDetail}
        showModal={showModal}
        handleClose={handleCloseModal}></ProductDetailModal>
      {/* <ProductEditModal product={productDetail}
        showModal={showModal}
        handleClose={handleCloseModal}></ProductEditModal> */}
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

    </div>

  );
};

export default ProductList;
