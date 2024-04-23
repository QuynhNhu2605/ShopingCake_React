
import { Card, Button, Row, Col } from "react-bootstrap";
const Cart = ({ carts, products }) => {
    console.log(carts)
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
                    <h3>Carts List</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    ProductId
                                </th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>
                                    Image
                                </th>
                                <th>
                                    Quantity
                                </th>
                                {/* More table headers */}
                            </tr>
                        </thead>
                        <tbody>
                            {carts.map((cart, index) => (
                                <tr key={index}>
                                    <td>{products && (products.find(p => p.productId === cart.productId))?.productId}</td>
                                    <td>{products && (products.find(p => p.productId === cart.productId))?.name}</td>
                                    <td>{products && (products.find(p => p.productId === cart.productId))?.category}</td>
                                    <td>{products && (products.find(p => p.productId === cart.productId))?.price}</td>
                                    <td><img style={{ height: "100px" }} src={products && (products.find(p => p.productId === cart.productId))?.imageUrl}></img>
                                    </td>
                                    <td>{cart.quantity}
                                    </td>
                                    {/* Hiển thị các thuộc tính khác nếu cần */}
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </Col>
            </Row>

        </div >

    )
}
export default Cart;