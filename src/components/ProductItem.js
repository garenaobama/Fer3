import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import prodcompare from "../images/prodcompare.svg";
import wish from "../images/wish.svg";
import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
const ProductItem = (props) => {
  const { product, brand } = props;
  return (
    <>
        <Link className="product-card position-relative" to={"/product/"+ product.id}>
          <div className="wishlist-icon position-absolute">
            <button className="border-0 bg-transparent">
              <img src={wish} alt="wishlist" />
            </button>
          </div>
          <div style={{ height: "250px" }}>
            {product.images && product.images.length > 0 && (
              <img src={product.images[0]} alt="" style={{ width: "95%" }} />
            )}
          </div>
          <div className="product-details">
            <h6 className="brand">{brand}</h6>
            <h5 className="product-title">
              {product.name}
            </h5>
            <ReactStars
              count={5}
              size={24}
              value={4}
              edit={false}
              activeColor="#ffd700"
            />
            <p className="price">${product.price}</p>
          </div>
          <div className="action-bar position-absolute">
            <div className="d-flex flex-column gap-15">
              <button className="border-0 bg-transparent">
                <img src={prodcompare} alt="compare" />
              </button>
              <button className="border-0 bg-transparent">
                <img src={view} alt="view" />
              </button>
              <button className="border-0 bg-transparent">
                <img src={addcart} alt="addcart" />
              </button>
            </div>
          </div>
        </Link>
    </>
  );
};

export default ProductItem;