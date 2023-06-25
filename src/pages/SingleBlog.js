import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BreadCrumb from '../components/BreadCrumb';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import Meta from '../components/Meta';
import Container from '../components/Container';

const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState({});

    useEffect(() => {
        fetch(`http://localhost:9999/blogs/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setBlog(data);
            });
    }, [id]);

    return (
        <>
            <Meta title={blog.title} />
            <BreadCrumb title={blog.title} />
            <Container class1="blog-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-12">
                        <div className="single-blog-card">
                            <Link
                                to="/blogs"
                                className="d-flex align-items-center gap-10"
                            >
                                <HiOutlineArrowLeft className="fs-4" /> Go back
                                to Blogs
                            </Link>
                            <h3 className="title">
                                {blog.title}
                            </h3>
                            <img
                                src={blog.image}
                                className="img-fluid my-4 d-block m-auto"
                                style={{ maxHeight: "500px"}}
                                alt="blog"
                            />
                            <p>{blog.body}</p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default SingleBlog;
