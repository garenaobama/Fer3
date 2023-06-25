import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useParams } from "react-router-dom";
import ProductItem from "../components/ProductItem";


const SingleProduct = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [relatedProducts, setRelatedProduct] = useState([]);
  const [mainImage, setMainImage] = useState([]);
  const { color } = products;
  const { detail } = products;
  const { images } = products;

  useEffect( //fetch product data by id
    () => {
      fetch(`http://localhost:9999/products/` + id)
        .then(res => res.json())
        .then(
          json => {
            setProducts(json);
          }
        );
    }, [id]
  );

  useEffect(
    () => {
      setMainImage(images ? images[0] : "/dsa");
    }, [images]
  );

  const smallImageStyle = {
    boxShadow: "0px 2px 7px 0px",
  };

  const formatConfiguration = (input) => { //format configuration text
    const [label, value] = input.split(': ');
    return (
      <>
        <td style={{ fontWeight: "bold" }}>{label}</td>
        <td>{value}</td>
      </>
    );
  }

  useEffect(
    () => {
      fetch(`http://localhost:9999/products`)
        .then(res => res.json())
        .then(json => {
          const result = json.slice(0, 4); //get just 4 products
          setRelatedProduct(result);
        }
        );
    }, []
  );

  const [orderedProduct, setorderedProduct] = useState(true);

  const closeModal = () => { };
  return (
    <>
      <Meta title={"Product Name"} />
      <BreadCrumb title="Product Name" />
      <Container class1="main-product-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-7 row">

            <div className="d-flex flex-column col-2">
              {images && images.length > 0 && images.map((img) =>
                <div key={img} className="mb-2" >
                  <button className="btn" onClick={() => setMainImage(img)}>
                    <img src={img} alt="product" style={{ width: "95%" }} />
                  </button>
                </div>
              )}
            </div>
            <div className="mb-5 col-10">
              {images && images.length > 0 && (
                <img src={mainImage} alt="product" style={{ width: "95%" }} />
              )}
            </div>
            <Container class1="description-wrapper py-5 home-wrapper-2">
              <div className="row">
                <div className="col-12">
                  <h4>Product information</h4>
                  <div className="bg-white p-3">
                    <p>
                      {products.describe}
                    </p>
                  </div>
                </div>
              </div>
            </Container>

          </div>
          <div className="col-5">
            <div className="main-product-details">
              <div className="border-bottom">
                <h2 className="title">
                  {products.name}
                </h2>
              </div>
              <div className="border-bottom py-3">
                <p className="price">$ {products.price}</p>
                <div className="d-flex align-items-center gap-10">
                  <ReactStars
                    count={5}
                    size={24}
                    value={4}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <p className="mb-0 t-review">( 2 Reviews )</p>
                </div>
              </div>
              <div className=" py-3">
                <h3 className="product-heading pb-2">Color :</h3>
                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                  {color && color.length > 0 && color.map((cl, index) =>
                    <div key={cl}>
                      <input onChange={(e) => setMainImage(images[e.target.value])} value={index} type="radio" className="btn-check" name="btnradio" id={"btnradio" + index} autoComplete="off" />
                      <label className="btn btn-outline-primary" htmlFor={"btnradio" + index}>{cl}</label>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-15 flex-row mt-5 mb-5">
                  <h3 className="product-heading">Quantity :</h3>
                  <div className="">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={1}
                      className="form-control"
                      style={{ width: "70px" }}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-30 mt-5 mb-5">
                  <button
                    className="button border-0"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    type="button"
                  >
                    Add to Cart
                  </button>
                  <button className="button signup">Buy It Now</button>
                </div>
                <div className="d-flex align-items-center gap-15">
                  <div>
                    <a href="/">
                      <AiOutlineHeart className="fs-5 me-2" /> Add to Wishlist
                    </a>
                  </div>
                </div>
                <div className="d-flex gap-10 flex-column  my-3">
                  <h3 className="product-heading">Shipping & Returns :</h3>
                  <p className="product-data">
                    Free shipping and returns available on all orders! <br /> We
                    ship all US domestic orders within
                    <b>5-10 business days!</b>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3">
              <h4 className="pb-3">Configuration of {products.name}</h4>
              <table className="table">
                <tbody>
                  {detail && detail.length > 0 && detail.map((dtl) =>
                    <tr key={dtl} className="mb-2" >
                      {formatConfiguration(dtl)}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </Container>

      <Container class1="reviews-wrapper home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 id="review">Reviews</h3>
            <div className="review-inner-wrapper">
              <div className="review-head d-flex justify-content-between align-items-end">
                <div>
                  <h4 className="mb-2">Customer Reviews</h4>
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      count={5}
                      size={24}
                      value={4}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p className="mb-0">Based on 2 Reviews</p>
                  </div>
                </div>
              </div>
              <div className="reviews mt-4">
                <div className="review">
                  <div className="d-flex gap-10 align-items-center">
                    <h6 className="mb-0">Navdeep</h6>
                    <ReactStars
                      count={5}
                      size={24}
                      value={4}
                      edit={false}
                      activeColor="#ffd700"
                    />
                  </div>
                  <p className="mt-3">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Consectetur fugit ut excepturi quos. Id reprehenderit
                    voluptatem placeat consequatur suscipit ex. Accusamus dolore
                    quisquam deserunt voluptate, sit magni perspiciatis quas
                    iste?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Related Products</h3>
            <div className="row">
              {
                relatedProducts.map((p) => (
                  <div className="col-3" key={p.id}>
                    <ProductItem {...p}></ProductItem>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="row">

        </div>
      </Container>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header py-0 border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body py-0">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 w-50">
                  {images && images.length > 0 && (
                    <img src={mainImage} alt="product" style={{ width: "95%" }} />
                  )}
                </div>
                <div className="d-flex flex-column flex-grow-1 w-50">
                  <h6 className="mb-3">{products.name}</h6>
                  <p className="mb-1">quantity: {1}</p>
                  <p className="mb-1">Color: { }</p>
                  <p className="mb-1">Size: { }</p>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 py-0 justify-content-center gap-30">
              <button type="button" className="button" data-bs-dismiss="modal">
                View My Cart
              </button>
              <button type="button" className="button signup">
                Checkout
              </button>
            </div>
            <div className="d-flex justify-content-center py-3">
              <Link
                className="text-dark"
                to="/product"
                onClick={() => {
                  closeModal();
                }}
              >
                Continue To Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
