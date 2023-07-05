import React from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useState, useEffect } from "react";
const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
const Checkout = () => {
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem("cart")));
  const [products, setProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("data")));
  const [addressObject, setAddressObject] = useState([])

  useEffect(() => {
    fetch("http://localhost:9999/users/" + user.email)
      .then(res => res.json())
      .then(json => {
        setAddressObject({
          state: json.address.state ?? '',
          city: json.address.city ?? '',
          detailAddress: json.address.detailAddress ?? '',
          zipcode: json.address.zipcode ?? ''
        })
      })
  }, []
  )

  const [order, setOrder] = useState({
    userId: user.id,
    phone: user?.phone ?? '',
    address: addressObject
  });

  useEffect( //handle event when quantity or cart is updated
    () => {
      var temp = 0;
      products.map((p, index) =>
        temp += Number(p.price) * cart[index].quantity
      )
      setSubTotal(temp); //update subtotal each time cart changes
      console.log(addressObject)
    }, [cart, products]
  )


  // useEffect(() => {
  //   fetch(`https://restcountries.com/v3.1/all?fields=name`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCountryList(data);
  //       var temp = [...countryList];
  //       temp.sort((a, b) => a.name.common.localeCompare(b.name.common));
  //       setCountryList(temp);
  //     });
  // }, []);


  useEffect(() => {
    Promise.all(  //wait for all of the fetch requests to complete before updating the state with the fetched data.
      cart.map((c) => {
        return fetch(`http://localhost:9999/products/` + c.productId)
          .then((res) => res.json())
          .then((json) => {
            json.index = c.id;  // index of products will match cart id
            return json;
          });
      })
    ).then((data) => {
      setProducts(data);
      //console.log(cart);
    }
    );
  }, []);

  return (
    <>
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-7">
            <div className="checkout-left-data">
              <h3 className="website-name">Fer3 store</h3>
              <nav
                style={{ "--bs-breadcrumb-divider": ">" }}
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="text-dark total-price" to="/cart">
                      Cart
                    </Link>
                  </li>
                  &nbsp; /&nbsp;
                  <li
                    className="breadcrumb-ite total-price active"
                    aria-current="page"
                  >
                    Information
                  </li>
                  &nbsp; /
                  <li className="breadcrumb-item total-price active">
                    Shipping
                  </li>
                  &nbsp; /
                  <li
                    className="breadcrumb-item total-price active"
                    aria-current="page"
                  >
                    Payment
                  </li>
                </ol>
              </nav>
              <h4 className="mb-3">Shipping Address</h4>
              <form
                action=""
                className="d-flex gap-15 flex-wrap justify-content-between"
              >
                <div className="w-100">
                  <select name="" className="form-control form-select" id="">
                    <option value="" selected disabled>
                      USA
                    </option>
                  </select>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="form-control"
                  />
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Phone"
                    className="form-control"
                  />
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Address"
                    className="form-control"
                  />
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="City"
                    className="form-control"
                  />
                </div>
                <div className="flex-grow-1">
                  <select name="" className="form-control form-select" id="">
                    <option value="" selected disabled>
                      Select State
                    </option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Zipcode"
                    className="form-control"
                  />
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-dark">
                      <BiArrowBack className="me-2" />
                      Return to Cart
                    </Link>
                    <Link to="/cart" className="button">
                      Checkout
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-5">
            {
              products.map((p, index) =>
                <div key={index} className="product border-bottom py-4">
                  <div className="d-flex gap-10 mb-2 align-align-items-center">
                    <div className="w-75 d-flex gap-10">
                      <div className="w-25 position-relative">
                        <img className="img-fluid" src={(p.color.map((i, idx) => (i === cart[index].color ? p.images[idx] : ''))).filter((pt) => pt !== '')} alt="product" />
                      </div>
                      <div>
                        <h5 className="total-price">{p.name}</h5>
                        <p className="total-price">{cart[index].color} x {cart[index].quantity}</p>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="total">$ {(p.price * cart[index].quantity).toFixed(2)}</h5>
                    </div>
                  </div>
                </div>
              )
            }

            {/* <div className="border-bottom py-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="total">Subtotal</p>
                <p className="total-price">$ 10000</p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 total">Shipping</p>
                <p className="mb-0 total-price">$ 10000</p>
              </div>
            </div> */}
            <div className="d-flex justify-content-between align-items-center border-bootom py-4">
              <h4 className="total">Total</h4>
              <h5 className="total-price">$ {subTotal.toFixed(2)}</h5>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Checkout;
