import React from "react";
import { Carousel } from "react-bootstrap";

const ProductCarousel = ({ products }) => {

  return (
    <Carousel>
      {/* {products.map((product, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={product.imageUrl}
            alt={`Product ${index + 1}`}
            style={{ height: "300px" }}
          />
          <Carousel.Caption>
            <h3>Welcome shop</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))} */}
      <Carousel.Item >
        <img
          className="d-block w-100"
          src="/assets/images/slide1.jpg"

          style={{ height: "400px" }}
        />
        <Carousel.Caption>
          <h3>Welcome shop</h3>
          {/* <p>{product.category}</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
        <img
          className="d-block w-100"
          src="/assets/images/slide2.jpg"

          style={{ height: "400px" }}
        />
        <Carousel.Caption>
          <h3>Welcome shop</h3>
          {/* <p>{product.category}</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
        <img
          className="d-block w-100"
          src="/assets/images/slide3.jpg"

          style={{ height: "400px" }}
        />
        <Carousel.Caption>
          <h3>Welcome shop</h3>
          {/* <p>{product.category}</p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarousel;
