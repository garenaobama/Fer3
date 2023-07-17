import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Paginate from '../components/Paginate';

const Bloglist = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:9999/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9999/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    filterBlogs();
  }, [filter]);

  useEffect(() => {
    sortBlogs();
  }, [sortKey, sortOrder]);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const filterBlogs = () => {
    const filtered = blogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(filter.toLowerCase()) ||
        getCategoryName(blog.categoryId).toLowerCase().includes(filter.toLowerCase())
      );
    });
    setBlogs(filtered);
  };

  const sortBlogs = () => {
    const sorted = [...blogs].sort((a, b) => {
      const valueA = getSortValue(a);
      const valueB = getSortValue(b);

      if (sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
    setBlogs(sorted);
  };

  const getSortValue = (blog) => {
    switch (sortKey) {
      case 'title':
        return blog.title;
      case 'category':
        return getCategoryName(blog.categoryId);
      default:
        return '';
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : '';
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    const { value } = event.target;
    const [key, order] = value.split(':');
    setSortKey(key);
    setSortOrder(order);
  };




  const handleView = (blogId) => {
    console.log(`View blog with ID ${blogId}`);
  };

  const handleEdit = (blogId) => {
    console.log(`Edit blog with ID ${blogId}`);
  };

  const handleDeleteBlog = (blogId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBlog(blogId);
      }
    });
  };

  const deleteBlog = (blogId) => {
    fetch(`http://localhost:9999/blogs/${blogId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          fetchBlogs();
          toast.success('Blog deleted successfully');
        } else {
          toast.error('Failed to delete blog');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleAddNewBlog = () => {
    //window.location.href = "/admin/Addblog";
  };

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
      <h3 className="mt-2">Blogs List</h3>
      <Row className="my-4">
        <Col xs={12} md={3}>
          <Form.Group className="mb-3" controlId="filter">
            <Form.Control
              type="text"
              placeholder="Search by Title or Category"
              value={filter}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select id="sort" value={`${sortKey}:${sortOrder}`} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="title:asc">Title (Ascending)</option>
            <option value="title:desc">Title (Descending)</option>
            <option value="category:asc">Category (Ascending)</option>
            <option value="category:desc">Category (Descending)</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={2} style={{ textAlign: 'right' }}>
          <Button variant="primary" onClick={handleAddNewBlog}>
            Add New Blog
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>ID</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Category</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.id}</td>
              <td>
                <img src={blog.image} alt={blog.title} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
              </td>
              <td>{blog.title}</td>
              <td>{getCategoryName(blog.categoryId)}</td>
              <td>
                <Button variant="primary" className="mx-1">
                  <Link className="text-white" to={`/admin/blogdetails/${blog.id}`}>
                    View
                  </Link>
                </Button>
                <Button variant="warning" className="mx-1" onClick={() => handleEdit(blog.id)}>
                  Edit
                </Button>
                <Button variant="danger" className="mx-1" onClick={() => handleDeleteBlog(blog.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </Col>
  );
};

export default Bloglist;
