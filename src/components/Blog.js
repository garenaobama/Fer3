import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";
import Container from "../components/Container";
import { useParams } from "react-router-dom";
import axios from "axios";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterBy, setFilterBy] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9999/blogs")
      .then((res) => res.data)
      .then((data) => {
        setBlogs(data.slice(-4));
      });
    axios
      .get("http://localhost:9999/categories")
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <>
      <Meta title={"Blogs"} />
      <BreadCrumb title="Blogs" />
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Find By Categories</h3>
              <div>
                <ul className="ps-0">
                  {categories.map((c) => (
                    <li
                      key={c.id}
                      style={{
                        textDecoration:
                          filterBy === c.id ? "underline" : "none",
                      }}
                      onClick={() => setFilterBy(c.id)}
                    >
                      {c.name}
                    </li>
                  ))}
                  <li onClick={() => setFilterBy(null)}>
                    <strong>Clear</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="row">
              {filterBy
                ? blogs
                    .filter((blog) => blog.categoryId === filterBy)
                    .map((blog) => (
                      <div className="col-6 mb-3">
                        <BlogCard blog={blog} />
                      </div>
                    ))
                : blogs.map((blog) => (
                    <div className="col-6 mb-3">
                      <BlogCard blog={blog} />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blog;
