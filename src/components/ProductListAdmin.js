import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import ProductDetailModal from "./ProductDetailModal";
const ProductListAdmin = ({ products }) => {
    const [showModal, setShowModal] = useState(false);
    const [productDetail, setProductDetail] = useState([])
    const handleShowModalDetail = (product) => {
        setShowModal(true)
        setProductDetail(product)
    }
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleDelete = async (pId) => {
        console.log(pId);
        try {
            const updatedProducts = products.filter(product => product.productId !== pId);
            const deletedProducts = products.find(product => product.productId === pId);
            console.log(updatedProducts);
            await axios.delete(`http://localhost:9999/products`, deletedProducts);
            alert('Products deleted successfully!');
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };
    return (
        <div>
            {/* Main content */}
            <Row>
                <Col>
                    {/* Filter and create button */}
                    <div className="d-flex justify-content-between">
                        <div>
                            <input type="text" placeholder="Filter" className="form-control" />
                        </div>
                        <div>
                            <Button variant="success">Create</Button>
                        </div>
                    </div>
                    {/* Table */}
                    <h3>Product List</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    Image
                                </th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>

                                </th>
                                {/* More table headers */}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td><img style={{ height: "100px" }} src={product.imageUrl}></img></td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td> <Button
                                        variant="primary"
                                        onClick={() => handleShowModalDetail(product)}
                                    >
                                        Details
                                    </Button></td>
                                    <Button onClick={() => handleDelete(product.productId)} style={{ margin: "5px" }}>
                                        Delete
                                    </Button>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </Col>
            </Row>
            <div>
                <ProductDetailModal product={productDetail}
                    showModal={showModal}
                    handleClose={handleCloseModal}></ProductDetailModal>
            </div>
        </div>
    );
};

export default ProductListAdmin;
