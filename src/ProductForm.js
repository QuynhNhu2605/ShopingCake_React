import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formCategory">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formYear">
        <Form.Label>Year</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter year"
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Product
      </Button>
    </Form>
  );
};

export default ProductForm;
