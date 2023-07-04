import { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Paginate from '../components/Paginate';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

const Productlist = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState();
  const [categoryId, setCategoryId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:9999/brands`)
        .then((res) => res.json())
        .then((json) => setBrands(json));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:9999/categories`)
        .then((res) => res.json())
        .then((json) => setCategories(json));
  }, []);

  const fetchProducts = (page) => {
    let url = `http://localhost:9999/products/?_sort=id&_order=desc&_page=${page}&_limit=10`;

    if (nameSearch) {
        url += `&name_like=${nameSearch}`;
    }

    if (statusFilter) {
        url += `&status=${statusFilter}`;
    }

    if (categoryId) {
        url += `&categoryId=${categoryId}`;
    }

    fetch(url)
        .then((res) => {
            const totalCount = res.headers.get('X-Total-Count');
            setTotalPages(Math.ceil(totalCount / 10));
            return res.json();
        })
        .then((json) => setProducts(json))
        .catch((err) => toast.error(err));
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, nameSearch, statusFilter, categoryId]);

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

    const handleDeleteProduct = (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(productId);
            }
        });
    };

    const deleteProduct = (productId) => {
        fetch(`http://localhost:9999/products/${productId}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (res.ok) {
                    fetchProducts(currentPage);
                    toast.success('Product deleted successfully');
                } else {
                toast.error('Failed to delete product')
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const changeStatus = (productId, status) => {
        fetch(`http://localhost:9999/products/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: !status
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => {
                if (res.ok) {
                    fetchProducts(currentPage);
                    toast.success('Change status successfully');
                } else {
                    toast.error('Failed to change status')
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const changeFeatured = (productId, featured) => {
        fetch(`http://localhost:9999/products/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                featured: !featured
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => {
                if (res.ok) {
                    fetchProducts(currentPage);
                    toast.success('Change feature successfully');
                } else {
                    toast.error('Failed to change feature')
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

  return (
    <Col lg={12}>
        <h3 className="mt-2">Contacts List</h3>
        <Row className='my-4'>
            <Col xs={12} md={4}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control 
                        type="name" placeholder="Search by name..." 
                        value={nameSearch} onChange={(e) => setNameSearch(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col xs={12} md={3}>
                <Form.Select aria-label="status" value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value)}}>
                    <option value="">Select status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                </Form.Select>
            </Col>
            <Col xs={12} md={3}>
                <Form.Select aria-label="category" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
                    <option value="">Select category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </Form.Select>
            </Col>
            <Col xs={12} md={2} style={{textAlign: "right"}}>
                <Button variant="primary">
                    <Link className='text-white' to={'/admin/product/add-product'}>Add Product</Link>
                </Button>
            </Col>
        </Row>
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Original Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th className='text-center'>Status</th>
                    <th className='text-center'>Feature</th>
                    <th className='text-center'>Action</th>
                </tr>
            </thead>
            <tbody>
                {products
                    .filter((p) => {
                        const nameMatches = !nameSearch || p.name.toLowerCase().includes(nameSearch.toLowerCase());
                        return nameMatches;
                    })
                    .map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td><img style={{width: '50px', height: '50px', borderRadius: "10px", objectFit: "cover"}} src={p.images[0]}/> {p.name}</td>
                            <td>$ {p.price}</td>
                            <td>$ {p.originalPrice}</td>
                            <td>
                              {categories.map(c => (
                                c.id == p.categoryId ? c.name : ""
                              ))}
                            </td>
                            <td>
                              {brands.map(b => (
                                b.id == p.brand ? b.name : ""
                              ))}
                            </td>
                            <td className='text-center'>
                                {p.status === true ? (
                                    <Badge bg="primary" style={{cursor: "pointer"}} onClick={() => changeStatus(p.id, p.status)}>Active</Badge>
                                ) : (
                                    <Badge bg="warning" style={{cursor: "pointer"}} onClick={() => changeStatus(p.id, p.status)}>Inactive</Badge>
                                )}
                            </td>
                            <td className='text-center'>
                                {p.featured === true ? (
                                    <Badge bg="primary" style={{cursor: "pointer"}} onClick={() => changeFeatured(p.id, p.featured)}>Yes</Badge>
                                ) : (
                                    <Badge bg="warning" style={{cursor: "pointer"}} onClick={() => changeFeatured(p.id, p.featured)}>No</Badge>
                                )}
                            </td>
                            <td className='text-center'>
                                <Button variant="primary">
                                  <Link className='text-white' to={'/admin/product/' + p.id}>View</Link>
                                </Button>
                                <Button variant="primary" className="mx-2">
                                  <Link className='text-white' to={'/admin/product/edit/' + p.id}>Edit</Link>
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteProduct(p.id)}>
                                  Delete
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
    </Col>
  );
};

export default Productlist;
