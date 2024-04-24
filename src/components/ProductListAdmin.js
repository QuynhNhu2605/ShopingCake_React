import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import ProductDetailModal from "./ProductDetailModal";
import axios from "axios";

const ProductListAdmin = ({ }) => {
    const [showModal, setShowModal] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [products, setProducts] = useState([]);
    const [productDetail, setProductDetail] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        price: "",
        imageUrl: ""
    });

    const handleShowModalDetail = (product) => {
        setShowModal(true);
        setProductDetail(product);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseModalCreate = () => {
        setShowModalCreate(false);
    };

    const handleDelete = async (pId) => {
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

    useEffect(() => {
        axios.get('http://localhost:9999/products')
            .then(response => {
                setProducts(response.data);
                const categories = new Set(response.data.map(product => product.category));
                setUniqueCategories([...categories]);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const filteredProducts = products.filter((product) => {
        const productName = product.name.toLowerCase();
        const searchTermLowerCase = searchTerm.toLowerCase();
        const categoryMatched = selectedCategory === "" || product.category === selectedCategory;
        const price = parseFloat(product.price);
        let priceMatched = true;

        switch (selectedPriceRange) {
            case "50-100":
                priceMatched = price >= 50 && price <= 100;
                break;
            case "100-300":
                priceMatched = price >= 100 && price <= 300;
                break;
            case ">300":
                priceMatched = price > 300;
                break;
            default:
                break;
        }

        return productName.includes(searchTermLowerCase) && categoryMatched && priceMatched;
    });

    const handleCreateProduct = async () => {
        try {
            const formData = new FormData();
            console.log(newProduct.imageUrl.name)
            formData.append('file', newProduct.imageUrl); // Thêm ảnh vào FormData

            // Thêm các trường dữ liệu sản phẩm vào FormData
            formData.append('name', newProduct.name);
            formData.append('category', newProduct.category);
            formData.append('price', newProduct.price);

            // Gửi yêu cầu POST để tạo sản phẩm mới và tải ảnh lên máy chủ cùng một lúc
            const response = await axios.post('http://localhost:9999/products', formData);

            // Lấy đường dẫn tương đối của ảnh từ máy chủ (nếu cần)
            const imageUrl = response.data.imageUrl;

            // Reset form
            setNewProduct({
                name: '',
                category: '',
                price: '',
                imageUrl: imageUrl // Lưu đường dẫn tương đối của ảnh vào state
            });

            alert('Product created successfully!');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    return (
        <div>
            <h3>Product List</h3>
            {/* Main content */}
            <Row>
                <Col>
                    {/* Filter and create button */}
                    <div className="d-flex justify-content-between">
                        <div>
                            <input
                                type="text"
                                placeholder="Search by name"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className="form-control"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {uniqueCategories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                className="form-control"
                                value={selectedPriceRange}
                                onChange={(e) => setSelectedPriceRange(e.target.value)}
                            >
                                <option value="">All Prices</option>
                                <option value="50-100">50 - 100</option>
                                <option value="100-300">100 - 300</option>
                                <option value=">300">Greater than 300</option>
                            </select>
                        </div>
                        <div>
                            {/* <Button variant="success" onClick={() => setShowModalCreate(true)}>Create</Button> */}
                        </div>
                    </div>
                    {/* Table */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <td><img style={{ height: "100px" }} src={product.imageUrl} alt="Product" /></td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => handleShowModalDetail(product)}>Details</Button>
                                        {/* <Button onClick={() => handleDelete(product.productId)} style={{ margin: "5px" }}>Delete</Button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
            </Row>

            {/* Product detail modal */}
            <ProductDetailModal
                product={productDetail}
                showModal={showModal}
                handleClose={handleCloseModal}
            />

            {/* Create product modal */}
            <Modal show={showModalCreate} onHide={handleCloseModalCreate}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="productCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category" value={newProduct.category} onChange={handleInputChange}>
                                <option value="">Select Category</option>
                                {uniqueCategories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={newProduct.price} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="productImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="imageUrl" onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.files[0] })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalCreate}>Close</Button>
                    <Button variant="primary" onClick={handleCreateProduct}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductListAdmin;
