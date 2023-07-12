import React from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useState, useEffect } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import * as formik from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";

const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
const Checkout = () => {
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem("cart")));
  const [products, setProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("data")));
  const [order, setOrder] = useState([]);
  const { Formik } = formik;

  const schema = yup.object().shape({
    fullName: yup.string().required(),
    address: yup.string().required(),
    city: yup.string().required(),
    zipcode: yup.string().required(),
    phone: yup.number().required().typeError('Phone must contain only numbers')
  });

  useEffect( //handle event when quantity or cart is updated
    () => {
      var temp = 0;
      products.map((p, index) =>
        temp += Number(p.price) * cart[index].quantity
      )
      setSubTotal(temp.toFixed(2)); //update subtotal each time cart changes
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

  useEffect(() => {
    fetch("http://localhost:9999/users/" + user.email)
      .then(res => res.json())
      .then(json => setUser(json))
  }, []
  )

  useEffect(() => {
    setOrder({ //preset the order information based on user's information
      userId: user.id,
      name: user.name ?? '',
      phone: user.phone ?? '',
      address: {
        country: 'US',
        state: user.address?.state ?? '',
        city: user.address?.city ?? '',
        detailAddress: user.address?.detailAddress ?? '',
        zipcode: user.address?.zipcode ?? ''
      },
      productList:
        products.map((p, index) => ({
          productId: p.id,
          productName: p.name,
          categoryId : p.categoryId,
          brandId : p.brand,
          quantity: Number(cart[index].quantity),
          color: cart[index].color,
          unitPrice: Number(p.price),
          originalPrice: Number(p.originalPrice)
        })),
      totalAmount: Number(subTotal),
      date: new Date(),
      statusId: Number(1)
    })
  }, [user, products, subTotal]
  )

  // const inputInfo = (value, attr) => {
  //   if (attr === "phone" || attr === "name") {
  //     setOrder({
  //       ...order,
  //       [attr]: value
  //     })
  //   }
  //   else {
  //     setOrder({
  //       ...order,
  //       address: {
  //         ...order.address,
  //         [attr]: value
  //       }
  //     })
  //   }
  // }

  const checkOut = (values) => { //change the order preset by value that inputed from form
    var temp = {
      ...order,
      name: values.fullName,
      phone: values.phone,
      address: {
        ...order.address,
        address: values.address,
        city: values.city,
        state: values.state,
        zipcode: values.zipcode
      }
    }

    fetch('http://localhost:9999/order', {
      method: 'POST',
      body: JSON.stringify(
        temp
      ),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    Swal.fire({
      title: 'Order created !',
      icon: 'success',
      confirmButtonColor: '#3085d6',
    })
  }

  useEffect(() => {
    console.log(order)
  }, [order]

  )


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

              <Formik
                validationSchema={schema}
                onSubmit={
                  (values) => {
                    checkOut(values)
                  }
                }
                enableReinitialize={true}
                initialValues={{
                  fullName: user.name,
                  address: user.address?.detailAddress,
                  city: user.address?.city,
                  state: "Alabama",
                  zipcode: user.address?.zipcode,
                  phone: user.phone,
                }}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form className="row" noValidate onSubmit={handleSubmit}>
                    <div className="col-12">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          Country
                        </InputGroup.Text>
                        <select className="form-control form-select">
                          <option value="US">
                            US
                          </option>
                        </select>
                      </InputGroup>
                    </div>
                    <div className="col-6">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          Full name
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          className="form-control"
                          required
                          value={values.fullName}
                          onChange={handleChange}
                          isValid={touched.fullName && !errors.fullName}
                          isInvalid={!!errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </div>
                    <div className="col-6">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          Phone (+1)
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Phone"
                          className="form-control"
                          value={values.phone}
                          required
                          onChange={handleChange}
                          isValid={touched.phone && !errors.phone}
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </div>
                    <div className="col-12">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          Address
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="address"
                          placeholder="Address"
                          className="form-control"
                          value={values.address}
                          required
                          onChange={handleChange}
                          isValid={touched.address && !errors.address}
                          isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address}
                        </Form.Control.Feedback>
                      </InputGroup>

                    </div>
                    <div className="col-6">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          City
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="City"
                          className="form-control"
                          value={values.city}
                          required
                          onChange={handleChange}
                          isValid={touched.city && !errors.city}
                          isInvalid={!!errors.city}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      </InputGroup>

                    </div>
                    <div className="col-6">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          State
                        </InputGroup.Text>
                        <select onChange={handleChange} name="state" className="form-control form-select">
                          {states.map(s => order.address?.state == s ? (<option selected key={s} value={s}>{s}</option>) : (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </InputGroup>
                    </div>
                    <div className="flex-grow-1">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          Zipcode
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="zipcode"
                          placeholder="Zipcode"
                          className="form-control"
                          value={values.zipcode}
                          required
                          onChange={handleChange}
                          isValid={touched.zipcode && !errors.zipcode}
                          isInvalid={!!errors.zipcode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.zipcode}
                        </Form.Control.Feedback>
                      </InputGroup>

                    </div>
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link to="/cart" className="text-dark">
                          <BiArrowBack className="me-2" />
                          Return to Cart
                        </Link>
                        <button type="submit" className="button" style={{ border: 0 }}>
                          Checkout
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>

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
              <h5 className="total-price">$ {subTotal}</h5>
            </div>
          </div>
        </div>
      </Container >
    </>
  );
};

export default Checkout;
