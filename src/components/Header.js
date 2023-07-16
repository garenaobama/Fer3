import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import compare from "../images/compare.svg";
import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import { createContext, useContext, useState, useEffect } from "react";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useAuthentication } from "../util/use-authentication";
import { toast } from "react-toastify";
import { BiLogOut } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import logo from '../images/logo_home.png';
import { CartContext } from '../components/CartContext'

const Header = () => {
  const { isLogged } = useAuthentication();
  const navigate = useNavigate();
  const [thisUser, setThisUser] = useState();
  const { currentUser } = useAuthentication();
  const [searchKey, setSearchKey] = useState();
  const { cartQuantity, setCartQuantity } = useContext(CartContext)

  useEffect(() => {
    if (isLogged) {
      fetch("http://localhost:9999/users/" + JSON.parse(sessionStorage.getItem("data")).email)
        .then(res => res.json())
        .then(json => setThisUser(json))
    }
  }, [isLogged]
  )


  const handleLogout = () => {
    sessionStorage.removeItem('data')
    sessionStorage.removeItem('cart') //remove cart 
    toast.success("Successfully logged out!")
    navigate('/login')
  }

  return (
    <>
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-12 col-lg-2">
              <h2>
                <Link className="text-white"><img className='p-2' style={{ width: "70%" }} src={logo} alt='logo'></img></Link>
              </h2>
            </div>
            <div className="col-12 col-lg-5">
              <form action={"/ourStore/" + searchKey}>
                <div className="input-group">
                  <input
                    style={{ height: "50px" }}
                    onChange={(e) => setSearchKey(e.target.value)}
                    type="text"
                    className="form-control py-2"
                    placeholder="Search Product Here..."
                    aria-label="Search Product Here..."
                    aria-describedby="basic-addon2"
                  />
                  <span style={{ height: "50px" }} className="input-group-text p-3" id="basic-addon2">
                    <BsSearch className="fs-6 m-0" />
                  </span>
                </div>
              </form>
            </div>
            <div className="col-12 col-lg-5">
              <div className="header-upper-links d-flex align-items-center justify-content-around row">
                <div className="col-6 col-lg-3">
                  <Link
                    to="/compare-product"
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={compare} alt="compare" />
                    <p className="mb-0">
                      Compare <br /> Products
                    </p>
                  </Link>
                </div>
                {isLogged && (
                  <div className="col-6 col-lg-3">
                    <Link
                      to="/wishlist"
                      className="d-flex align-items-center gap-10 text-white"
                    >
                      <img src={wishlist} alt="wishlist" />
                      <p className="mb-0">
                        Favourite <br /> wishlist
                      </p>
                    </Link>
                  </div>
                )}
                {!isLogged && (
                  <div className="col-6 col-lg-3">
                    <Link
                      to="/login"
                      className="d-flex align-items-center gap-10 text-white"
                    >
                      <img src={user} alt="user" />
                      <p className="mb-0">
                        Log in
                      </p>
                    </Link>
                  </div>
                )}
                {isLogged && (
                  <div id="user-button-header" className="col-6 col-lg-3">
                    <Link to={"/"} className="d-flex align-items-center gap-10 text-white">
                      <img src={user} alt="user" />
                      <p style={{
                        maxWidth: "10ch",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                        className="mb-0">
                        {thisUser?.name}
                      </p>
                    </Link>
                    <div id="function-box-header">
                      <Link
                         to={`/profile/${currentUser.email}`}
                        className="d-flex align-items-center gap-10 text-white link-user-header-function"
                      >
                        <BiUser className="m-0" />My profile
                      </Link>
                      <Link
                        to={"/myOrder"}
                        className="d-flex align-items-center gap-10 text-white link-user-header-function"
                      >
                        <FaMoneyCheckDollar className="m-0" />My orders
                      </Link>
                      <Link
                        onClick={() => handleLogout()}
                        className="d-flex align-items-center gap-10 text-white link-user-header-function"
                      >
                        <BiLogOut className="m-0" />Log out
                      </Link>
                    </div>
                  </div>
                )}
                {isLogged && (
                  <div className="col-6 col-lg-3">
                    <Link
                      to="/cart"

                    >
                      <button type="button" class="btn position-relative">
                        <img src={cart} alt="cart" />
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {cartQuantity}
                          <span class="visually-hidden">unread messages</span>
                        </span>
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header >
      <header className="header-bottom py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex align-items-center row">
                <div className="col-12 col-lg-6">
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={menu} alt="" />
                      <span className="me-5 d-inline-block">
                        Shop Categories
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <Link className="dropdown-item text-white" to="">
                          Action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="">
                          Another action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="">
                          Something else here
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="menu-links col-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-center gap-15">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/product">Our Store</NavLink>
                    <NavLink to="/blogs">Blogs</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
