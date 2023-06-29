import { useEffect, useState } from 'react';
import { Col, Table } from 'react-bootstrap'

export default function Feedback(){
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(
        () => {
            fetch(`http://localhost:9999/feedbacks`)
                .then(res => res.json())
                .then(json => setFeedbacks(json));
        }, []
    );
    return (
        <Col lg={10}>
            <h3 className="mt-2">Feedbacks List</h3>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>User</th>
                        <th>Product</th>
                        <th>rating</th>
                        <th>comment</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        feedbacks.map((u) =>
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.userId}</td>
                                <td>{u.productId}</td>
                                <td>{u.rating}</td>
                                <td>{u.comment}</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </Col>
    )
}