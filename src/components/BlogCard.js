import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <div className="card-image">
        <img src={blog?.image} className="img-fluid w-100" alt="blog" style={{ maxHeight: 200, objectFit: 'contain'}} />
      </div>
      <div className="blog-content">
        <p className="date">1 Dec, 2022</p>
        <h5 className="title">{blog?.title}</h5>
        <p
          className="desc"
          style={{
            maxHeight: 70,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {blog?.body}
        </p>
        <Link to={`/blog/${blog?.id}`} className="button">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
