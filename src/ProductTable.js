import React from "react";
import { Table } from "react-bootstrap";

const ProductTable = ({ products }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.category}</td>
            <td>{product.year}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductTable;
