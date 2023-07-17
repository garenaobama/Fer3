import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:9999/blogs/${id}`);
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="main-product-wrapper py-5 home-wrapper-2 mt-2" style={{ marginBottom: '15px' }}>
      <div className="row">
        <div className="col-12 my-3" style={{ textAlign: 'right' }}>
          <Button className="btn-primary mx-2">
            <Link className="text-white" to={`/admin/blog/edit/${id}`}>
              Edit
            </Link>
          </Button>
          <Button className="btn-danger">
            <Link className="text-white" to="/admin/blog">
              Back to list
            </Link>
          </Button>
        </div>
        <div className="col-7 row">
          <h2 className="title">{blog.title}</h2>
          <p>{blog.body}</p>
          <div className="col-12 my-3">
            {blog.image && <img src={blog.image} alt="blog" style={{ width: '100%' }} />}
          </div>
        </div>
        
      </div>
    </Container>
  );
};

export default BlogDetails;
