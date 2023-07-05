import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import ProductItem from "../components/ProductItem";

const OurStore = () => {
  const [productList, setProductList] = useState([]); // productList that unchange
  const [products, setProducts] = useState([]); //productlist that use for display
  const [categories, setCategories] = useState([]); //category
  const [brands, setBrands] = useState([]); //brands
  const [isLoading, setIsLoading] = useState(false); //loading effect
  const [filterObject, setFilterObject] = useState({  // properties for filter 
    category: 0,
    year: 0,
    min: 0,
    max: 0,
    brand: 0
  });

  useEffect(() => {
    // console.log(filterObject);
    setProducts(products.filter((product) => {
      return (
        (filterObject.category == 0 || product.categoryId == filterObject.category) &&
        (filterObject.year == 0 || product.year == filterObject.year) &&
        (filterObject.min == 0 || parseFloat(product.price) >= filterObject.min) &&
        (filterObject.max == 0 || parseFloat(product.price) <= filterObject.max) &&
        (filterObject.brand == 0 || product.brand == filterObject.brand)
      );
    }));
    setIsLoading(false); // when finish filtering , display product
  }, [filterObject]); // filter each time the filter object changes

  var currentYear = new Date().getFullYear();
  const years = [currentYear--, currentYear--, currentYear--, currentYear--];

  // useEffect(
  //   () => {
  //     fetch(`http://localhost:9999/products`)
  //       .then(res => res.json())
  //       .then(json => {
  //         setProductList(json);
  //         setProducts(json);
  //       });
  //   }, []
  // );
  useEffect(() => {
    fetch(`http://localhost:9999/products`)
      .then(res => res.json())
      .then(json => {
        // Fetch category names for each product
        Promise.all(
          json.map(product =>
            fetch(`http://localhost:9999/brands/${product.brand}`)
              .then(res => res.json())
              .then(b => ({
                ...product,
                brandName: b.name
              }))
          )
        )
        .then(productsWithCategories => {
          setProductList(productsWithCategories);
          setProducts(productsWithCategories);
        });
      });
  }, []);

  useEffect(
    () => {
      fetch(`http://localhost:9999/categories`)
        .then(res => res.json())
        .then(json => setCategories(json));
    }, []
  );

  useEffect(
    () => {
      fetch(`http://localhost:9999/brands`)
        .then(res => res.json())
        .then(json => setBrands(json));
    }, []
  );

  function resetAllButton(name) {
    var categoryBox = document.getElementsByName(name);
    for (let i = 0; i < categoryBox.length; i++) {
      categoryBox[i].checked = false;
    }
  }

  function resetButton(name) {
    var categoryBox = document.getElementsByName(name);
    for (let i = 0; i < categoryBox.length; i++) {
      categoryBox[i].checked = false;
    }
  }

  function checkButton(id) {
    var categoryBox = document.getElementById(id);
    categoryBox.checked = true;
  }

  const filterProduct = (value, propName, checked, name, id) => {
    setProducts(productList);
    setIsLoading(true); // when loading , show the loading scene
    setFilterObject({
      ...filterObject,
      [propName]: value
    });
    if (propName === "min" || propName === "max") {
      setProducts(productList);
      return;
    }
    if (checked) { //filter
      resetButton(name);
      checkButton(id);
    }
    else {
      setFilterObject({
        ...filterObject,
        [propName]: 0
      });
      setProducts(productList);
    }
  }

  const SortProduct = (index) => {
    const newProducts = [...products];
    if (index == 0) newProducts.sort((a, b) => b.feartured - a.feartured);
    if (index == 1) newProducts.sort((a, b) => a.name.localeCompare(b.name));
    if (index == 2) newProducts.sort((a, b) => b.name.localeCompare(a.name));
    if (index == 3) newProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (index == 4) newProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (index == 5) newProducts.sort((a, b) => a.id - b.id);
    if (index == 6) newProducts.sort((a, b) => b.id - a.id);
    setProducts(newProducts);
  }
  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <Container class1="store-wrapper home-wrapper-2 py-5">
        <div className="filter-card mb-3">
          <div>
            <div className="product-tags d-flex flex-wrap align-items-center gap-10">
              {
                brands.map((b) =>
                  <div key={b.id}>
                    <input onChange={(e) => {
                      filterProduct(e.target.value, "brand", e.target.checked, e.target.name, e.target.id)
                    }}
                      name="brand-Filter-Box" type="checkbox" className="btn-check" id={"brandCheck" + b.id} autoComplete="off" value={b.id}
                    />
                    <label style={{ width: "150px" }} className="btn btn-outline-primary" htmlFor={"brandCheck" + b.id}>{b.name}</label>
                  </div>
                )
              }

            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Shop By Categories</h3>

              <div className="btn-group d-flex flex-column" role="group" aria-label="Basic checkbox toggle button group">
                {
                  categories.map((c) =>
                    <div key={c.id}>
                      <input onChange={(e) => {
                        filterProduct(e.target.value, "category", e.target.checked, e.target.name, e.target.id)
                      }} name="cate-Filter-Box" type="checkbox" className="btn-check" id={"btncheck" + c.id} autoComplete="off" value={c.id} />
                      <label style={{ width: "150px" }} className="btn btn-outline-primary" htmlFor={"btncheck" + c.id}>{c.name}</label>
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
                        <input onChange={(e) => filterProduct(e.target.value, "year", e.target.checked, e.target.name, e.target.id
                        )} name="year-Filter-Box" value={y} type="checkbox" className="btn-check" id={"yearCheck" + y} autoComplete="off" />
                        <label style={{ width: "100px" }} className="btn btn-outline-primary" htmlFor={"yearCheck" + y}>{y}</label>
                      </div>
                    )
                  }

                </div>
                <h5 className="sub-title">Price</h5>
                <div className="d-flex align-items-center gap-10">
                  <div className="form-floating">
                    <input
                      onChange={(e) => filterProduct(e.target.value, "min")}
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="From"
                    />
                    <label htmlFor="floatingInput">From</label>
                  </div>
                  <div className="form-floating">
                    <input
                      onChange={(e) => filterProduct(e.target.value, "max")}
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
              <div className="d-flex flex-wrap row">
                {isLoading ? (
                  <div className="spinner-grow" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  products.map(p => ( p.status ?  
                    <div className="col-3" key={p.id}>
                      <ProductItem {...p}></ProductItem>
                    </div> : ''
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default OurStore;
