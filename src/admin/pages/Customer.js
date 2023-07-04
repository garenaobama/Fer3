import { useEffect, useState } from 'react';
import Paginate from '../components/Paginate';
import { toast } from 'react-toastify';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { AiOutlineSortAscending } from "react-icons/ai";
import InputGroup from 'react-bootstrap/InputGroup';

export default function Customer() {
    const [users, setUsers] = useState([]);
    const [emailSearch, setEmailSearch] = useState('');
    const [nameSearch, setNameSearch] = useState('');

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    //

    // useEffect(
    //     () => {
    //         fetch(`http://localhost:9999/users`)
    //             .then(res => res.json())
    //             .then(json => setUsers(json));
    //     }, []
    // );


    const handleSearch = (page) => {
        let url = `http://localhost:9999/users/?role=Customer&_sort=id&_order=desc&_page=${page}&_limit=10`;

        if (emailSearch) {
            url += `&email_like=${emailSearch}`;
        }

        if (nameSearch) {
            url += `&name_like=${nameSearch}`;
        }

        fetch(url)
            .then((res) => {
                const totalCount = res.headers.get('X-Total-Count');
                setTotalPages(Math.ceil(totalCount / 10));
                return res.json();
            })
            .then((json) => setUsers(json))
            .catch((err) => toast.error(err));
    }

    useEffect(() => {
        handleSearch(currentPage);
    }, [currentPage, emailSearch, nameSearch]);

    const [nameOrder, setNameOrder] = useState(true);
    const [emailOrder, setEmailOrder] = useState(true);
    const sortCustomer = (attr) => {
        const newUserList = [...users];
        if (attr == "name") {
            setNameOrder(!nameOrder)
            if (nameOrder) newUserList.sort((a, b) => a.name.localeCompare(b.name))
            else newUserList.sort((a, b) => b.name.localeCompare(a.name))
        }
        if (attr == "email") {
            setEmailOrder(!emailOrder)
            if (emailOrder) newUserList.sort((a, b) => a.email.localeCompare(b.email))
            else newUserList.sort((a, b) => b.email.localeCompare(a.email))
        }
        setUsers(newUserList);
    }

    var i = 1; // number on users
    return (
        <Col lg={10}>
            <h3 className="mt-2">Customer List</h3>
            <Row className='my-4'>
                <Col xs={12} md={4}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            Email
                        </InputGroup.Text>
                        <Form.Control
                            type="email" placeholder="Search by email..."
                            value={emailSearch} onChange={(e) => setEmailSearch(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col xs={12} md={4}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            Name
                        </InputGroup.Text>
                        <Form.Control
                            type="email" placeholder="Search by name..."
                            value={nameSearch} onChange={(e) => setNameSearch(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email <button onClick={() => sortCustomer("email")} className='btn btn-light'><AiOutlineSortAscending className='m-0' /></button></th>
                        <th>Name <button onClick={() => sortCustomer("name")} className='btn btn-light'><AiOutlineSortAscending className='m-0' /></button></th>
                        <th>Phone</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((u) =>
                            <tr key={u.id}>
                                <td>{(currentPage - 1) * 10 + i++}</td>
                                <td>{u.email}</td>
                                <td>{u.name}</td>
                                <td>{u.phone}</td>
                                <td>{
                                    u.address.zipcode + ", "
                                    + u.address.detailAddress + ", "
                                    + u.address.street + ", "
                                    + u.address.district + ", "
                                    + u.address.province + ", "
                                    + u.address.country
                                }</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>

            <div className="pagination mb-3 justify-content-end">
                <Paginate
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                />
            </div>
        </Col>
    )
}