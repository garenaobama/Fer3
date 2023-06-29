import { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Paginate from '../components/Paginate';

export default function Contact() {
    const [contacts, setContacts] = useState([]);
    const [show, setShow] = useState(false);
    const [comment, setComment] = useState('');
    const [emailSearch, setEmailSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        fetch(`http://localhost:9999/contacts/${id}`)
            .then((res) => res.json())
            .then((json) => {
                setComment(json.comment)
                if (json.status === 'New') {
                    fetch('http://localhost:9999/contacts/' + id,{
                        method: 'PATCH',
                        body: JSON.stringify({
                            status: 'Read'
                        }),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                    })
                    .catch(() => toast.error('Something went wrong!'))

                    fetch(`http://localhost:9999/contacts/?&_sort=id&_order=desc&_page=1&_limit=10`)
                        .then((res) => {
                            const totalCount = res.headers.get('X-Total-Count');
                            setTotalPages(Math.ceil(totalCount / 10));
                            return res.json();
                        })
                        .then((json) => setContacts(json));
                }
            })
            .catch(err => toast.error(err));

        setShow(true)
    };

    useEffect(() => {
        fetch(`http://localhost:9999/contacts`)
            .then((res) => res.json())
            .then((json) => setContacts(json));
    }, []);


    const fetchContacts = (page) => {
        let url = `http://localhost:9999/contacts/?_sort=id&_order=desc&_page=${page}&_limit=10`;

        if (emailSearch) {
            url += `&email_like=${emailSearch}`;
        }

        if (statusFilter) {
            url += `&status=${statusFilter}`;
        }

        fetch(url)
            .then((res) => {
                const totalCount = res.headers.get('X-Total-Count');
                setTotalPages(Math.ceil(totalCount / 10));
                return res.json();
            })
            .then((json) => setContacts(json))
            .catch((err) => toast.error(err));
    };

    useEffect(() => {
        fetchContacts(currentPage);
    }, [currentPage, emailSearch, statusFilter]);

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

    return (
        <Col lg={12}>
            <h3 className="mt-2">Contacts List</h3>
            <Row className='my-4'>
                <Col xs={12} md={4}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Control 
                            type="email" placeholder="Search by email..." 
                            value={emailSearch} onChange={(e) => setEmailSearch(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Select aria-label="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">Select status</option>
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                    </Form.Select>
                </Col>
            </Row>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th className='text-center'>Status</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts
                        .filter((u) => {
                            console.log(u)
                            const emailMatches = !emailSearch || u.email.toLowerCase().includes(emailSearch.toLowerCase());
                            const statusMatches = !statusFilter || u.status === statusFilter;

                            return emailMatches && statusMatches;
                        })
                        .map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.phone}</td>
                                <td className='text-center'>
                                    {u.status === 'New' ? (
                                        <Badge bg="primary">New</Badge>
                                    ) : (
                                        <Badge bg="success">Read</Badge>
                                    )}
                                </td>
                                <td className='text-center'>
                                    <Button variant="primary" onClick={() => handleShow(u.id)}>
                                        View
                                    </Button>
                                </td>
                            </tr>
                    ))}
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

            <Modal show={show} size='lg' centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {comment}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
}
