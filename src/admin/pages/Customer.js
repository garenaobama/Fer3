import { useEffect, useState } from 'react';
import { Col, Table } from 'react-bootstrap'
export default function Customer() {
    const [users, setUsers] = useState([]);

    useEffect(
        () => {
            fetch(`http://localhost:9999/users`)
                .then(res => res.json())
                .then(json => setUsers(json));
        }, []
    );

    return (
        <Col lg={10}>
            <h1 className='mt-5'>Customer List</h1>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.filter(user => user.role == 'Customer').map((u) =>
                            <tr key={u.id}>
                                <td>{u.email}</td>
                                <td>{u.name}</td>
                                <td>{u.phone}</td>
                                <td>{
                                    u.address.zipcode + ", "
                                    +u.address.detailAddress + ", "
                                    +u.address.street + ", "
                                    +u.address.district + ", "
                                    +u.address.province + ", "
                                    +u.address.country
                                }</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </Col>
    )
}