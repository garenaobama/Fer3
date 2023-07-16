import React, { useContext } from "react";
import { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Swal from "sweetalert2";
import { CartContext } from '../components/CartContext'

const Cart = () => {
  const {cartQuantity ,setCartQuantity} = useContext(CartContext); //update cart globaly
  // const user = JSON.parse(sessionStorage.getItem("data"));
  // console.log(user.name);
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem("cart")));
  const [quantity, setQuantity] = useState(cart?.map(c => c.quantity))
  const [products, setProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  useEffect(() => {
    Promise.all(  //wait for all of the fetch requests to complete before updating the state with the fetched data.
      cart?.map((c) => {
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

  useEffect( //handle event when quantity or cart is updated
    () => {
      var temp = 0;
      products.map((p, index) =>
        temp += Number(p.price) * quantity[index]
      )
      setSubTotal(temp); //update subtotal each time cart changes
      sessionStorage.setItem("cart", JSON.stringify(cart)) //when cart changes , update cart in session
      //console.log(products);
    }, [cart, products]
  )

  const deleteCart = (index) => {
    //console.log(cart.filter((c) => c.id !== id));
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
        sessionStorage.setItem("cart", JSON.stringify(cart.filter((c,idx) => idx !== index)))
        setCart(JSON.parse(sessionStorage.getItem("cart")))
        setProducts(products.filter((p, idx) => idx != index)) //when delete cart , update the product array
        setQuantity(quantity.filter((q, idx)  => idx != index)) //when delete cart , update the quantity array
        Swal.fire(
          'Deleted!',
          'Your item has been deleted.',
          'success'
        )
        setCartQuantity(cartQuantity-1)
      }
    })
  }

  const changeQuantity = (value, index) => {
    var tempCart =  //this temp will save a cart item will new value 
    {
      productId: cart[index].productId,
      color: cart[index].color,
      quantity: value,
    }
    setQuantity(quantity.map((q, idx) => idx == index ? value : q))
    var tempFullCart = cart.map((c, idx) => idx == index ? tempCart : c) // this temp update cart list with new quality value
    setCart(tempFullCart);
  }
  return (
    <div>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1">Product</h4>
              <h4 className="cart-col-2">Price</h4>
              <h4 className="cart-col-3">Quantity</h4>
              <h4 className="cart-col-4">Total</h4>
              <h4 className="cart-col-2">Action</h4>
            </div>
            {
              cart && cart.length > 0 && products && products.length > 0 && products.map((p, index) =>
                <div key={[p.id, cart[index].color]} className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center">
                  <Link to={"/product/" + p.id} className="cart-col-1 gap-15 d-flex align-items-center">
                    <div className="w-25">
                      <img src={(products && products.length > 0) ? (p.color.map((i, idx) => (i === cart[index].color ? p.images[idx] : ''))).filter((pt) => pt !== '') : ''} className="img-fluid" alt="product" />
                    </div>
                    <div className="w-75">
                      <p>{p.name}</p>
                      <p>Color: {cart[index].color}</p>
                    </div>
                  </Link>
                  <div className="cart-col-2">
                    <h5 className="price">$ {p.price}</h5>
                  </div>
                  <div className="cart-col-3 d-flex align-items-center gap-15">
                    <div>
                      <input
                        onChange={(e) => changeQuantity(e.target.value, index)}
                        className="form-control"
                        type="number"
                        name=""
                        min={1}
                        max={10}
                        id=""
                        value={quantity[index]}
                      />
                    </div>
                  </div>
                  <div className="cart-col-4">
                    <h5 className="price"> $ {(p.price * quantity[index]).toFixed(2)}</h5>
                  </div>
                  <div className="cart-col-2">
                    <button onClick={() => deleteCart(index)} className="btn btn-danger"><AiOutlineDelete size={25} className="m-0" />delete</button>
                  </div>
                </div>
              )
            }

          </div>
          <div style={{position: "sticky" , bottom: 0, background: "#ffcccc" , borderRadius:"10px"}} className="col-12 py-2 mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
              <Link to="/product" className="button">
                Continue To Shopping
              </Link>
              <div className="d-flex flex-column align-items-end">
                <h4>SubTotal: $ {subTotal.toFixed(2)}</h4>
                <p>Taxes and shipping calculated at checkout</p>
                {
                  cartQuantity > 0 ? <Link to="/checkout" className="button disable">
                  Checkout
                </Link> : ''
                }
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cart;
