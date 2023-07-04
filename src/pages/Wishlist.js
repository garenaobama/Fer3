import React, { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Wishlist = () => {
  const [wishlist, setWishList] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("data"));
  const [products, setProducts] = useState([]);

  useEffect(
    () => {
      fetch(`http://localhost:9999/wishLists/?userId=` + user.email)
        .then(res => res.json())
        .then(json => {
          setWishList(json.reverse())
        }
        );
    }, []
  );

  useEffect(
    () => {
      Promise.all(
        wishlist.map(w => {
          return fetch(`http://localhost:9999/products/` + w.productId)
            .then(res => res.json())
            .then(json => {
              return json
            })
        })
      ).then(data =>
        setProducts(data)
      )
    }, [wishlist]
  )

  const deleteWishList = (wishlistId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost:9999/wishLists/' + wishlistId, {
          method: 'DELETE',
        });
        Swal.fire(
          'Deleted!',
          'Your item has been deleted.',
          'success'
        )
        setWishList(wishlist.filter(w => w.id != wishlistId));
      }
    })
  }
  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="row">
          {
            products && products.length > 0 && products.map((p,index) =>
              <div className="col-3">
                <div className="wishlist-card d-flex flex-column justify-content-between position-relative p-2 mb-3" style={{ background: "white", height: "400px" }}>
                  <button onClick={() => deleteWishList(wishlist[index].id)} type="button" style={{ border: 0, right: "5%" }} className="btn position-absolute">
                    <img
                      src="images/cross.svg"
                      alt="cross"
                      className="cross img-fluid"
                    />
                  </button>
                  <div className="wishlist-card-image">
                    <Link to={"/product/" + p.id}>
                      <img
                        src={p.images[0]}
                        className="img-fluid w-100 p-5"
                        alt="product"
                      />
                    </Link>
                  </div>
                  <div className="py-3 px-3">
                    <h5 className="title">
                      {p.name}
                    </h5>
                    <h6 className="price">$ {p.price}</h6>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </Container>
    </>
  );
};

export default Wishlist;
