import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import ProductItem from "../components/ProductItem";

const OurStore = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  var currentYear = new Date().getFullYear();
  const years = [currentYear--, currentYear--, currentYear--, currentYear--, "older"];
  useEffect(
    () => {
      fetch(`http://localhost:9999/products`)
        .then(res => res.json())
        .then(json => setProducts(json));
    }, []
  );

  useEffect(
    () => {
      fetch(`http://localhost:9999/categories`)
        .then(res => res.json())
        .then(json => setCategories(json));
    }, []
  );

  const SortProduct = (index) => {
    console.log(index);
    const newProducts = [...products];
    if (index == 0) newProducts.sort((a, b) => b.id - a.id);
    if (index == 1) newProducts.sort((a, b) => a.name.localeCompare(b.name));
    if (index == 2) newProducts.sort((a, b) => b.name.localeCompare(a.name));
    if (index == 3) newProducts.sort((a, b) => a.price - b.price);
    if (index == 4) newProducts.sort((a, b) => b.price - a.price);
    if (index == 5) newProducts.sort((a, b) => a.id - b.id);
    if (index == 6) newProducts.sort((a, b) => b.id - a.id);
    setProducts(newProducts);
  }
  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <Container class1="store-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Shop By Categories</h3>

              <div className="btn-group d-flex flex-column" role="group" aria-label="Basic checkbox toggle button group">
                {
                  categories.map((c) =>
                    <div key={c.id}>
                      <input type="checkbox" className="btn-check" id={"btncheck" + c.id} autoComplete="off" />
                      <label style={{ width: "150px" }} className="btn btn-outline-danger" htmlFor={"btncheck" + c.id}>{c.name}</label>
                    </div>
                  )
                }

              </div>

            </div>
            <div className="filter-card mb-3">
              <h3 className="filter-title">Filter By</h3>
              <div>
                <h5 className="sub-title">Release year</h5>
                <div className="btn-group d-flex flex-column" role="group" aria-label="Basic checkbox toggle button group">
                  {
                    years.map((y) =>
                      <div key={y}>
                        <input type="checkbox" className="btn-check" id={"btncheck" + y} autoComplete="off" />
                        <label style={{ width: "100px" }} className="btn btn-outline-danger" htmlFor={"btncheck" + y}>{y}</label>
                      </div>
                    )
                  }

                </div>
                <h5 className="sub-title">Price</h5>
                <div className="d-flex align-items-center gap-10">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="From"
                    />
                    <label htmlFor="floatingInput">From</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput1"
                      placeholder="To"
                    />
                    <label htmlFor="floatingInput1">To</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="filter-card mb-3">
              <h3 className="filter-title">Brands</h3>
              <div>
                <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Apple
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Samsung
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Microsoft
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Xiaomi
                  </span>
                </div>
              </div>
            </div>

          </div>
          <div className="col-9">
            <div className="filter-sort-grid mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-10">
                  <p className="mb-0 d-block" style={{ width: "100px" }}>
                    Sort By:
                  </p>
                  <select
                    onChange={(e) => SortProduct(e.target.value)}
                    name="sort"
                    defaultValue={"manula"}
                    className="form-control form-select"
                    id="sort-box"
                  >
                    <option value="0">Featured</option>
                    <option value="1">Alphabetically, A-Z</option>
                    <option value="2">Alphabetically, Z-A</option>
                    <option value="3">Price, low to high</option>
                    <option value="4">Price, high to low</option>
                    <option value="5">Date, old to new</option>
                    <option value="6">Date, new to old</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="products-list pb-5">
              <div className="d-flex gap-10 flex-wrap">
                <div className="row">{
                  products.map(p => (
                    <div className="col-3" key={p.id}>
                      <ProductItem {...p}></ProductItem>
                    </div>
                  ))
                }

                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default OurStore;
