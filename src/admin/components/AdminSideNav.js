import { Card } from 'react-bootstrap';
import logo from '../../images/logo_full_black.png';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineStock } from "react-icons/ai";
import { AiOutlineShopping } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlinePicRight } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import { BiLogoTelegram } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import Nav from 'react-bootstrap/Nav';
import Accordion from 'react-bootstrap/Accordion';

export default function AdminSideNav(props) {
    const location = useLocation();
    console.log(location.pathname);
    return (
        <Nav fill variant="tabs" defaultActiveKey="/home" style={{
            border: "none",
            background: "white",
            position: "sticky",
            top: 0,
            minHeight: "100vh",
        }} className={props.className}>
            <Link className={location.pathname === '/' ? 'active' : ''} to={"/"}>
                <div className='d-flex justify-content-center'>
                    <img className='p-2' style={{ width: "70%" }} src={logo} alt='logo'></img>
                </div>
            </Link>
            <div className='mt-3 mb-3' style={{ width: "100%", height: "2px", background: "#00000038" }}></div>

            <Accordion>
                <Link style={{ width: "100%" }} to={"/admin/dashboard"}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <AiOutlineStock size="30px" style={{ marginBottom: 0, marginRight: "10px" }} />Dashboard
                        </Accordion.Header>
                    </Accordion.Item>
                </Link>
                <Link style={{ width: "100%" }} to={"/admin/order"}>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            <AiOutlineShopping style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Orders
                        </Accordion.Header>
                    </Accordion.Item>
                </Link>
                <div style={{ width: "100%" }} >
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            <AiOutlineShoppingCart style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Products
                        </Accordion.Header>
                        <Accordion.Body>
                            <Link style={{ width: "100%" }} to={"/admin/product"}> Product list</Link>
                            <Link style={{ width: "100%" }} to={"/admin/product/add-product"}> Add new product</Link>
                            <Link style={{ width: "100%" }} to={"/admin/product/add-brand"}> Brand</Link>
                            <Link style={{ width: "100%" }} to={"/admin/product/category-list"}> Category</Link>
                        </Accordion.Body>
                    </Accordion.Item>
                </div>
                <div style={{ width: "100%" }}>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>
                            <AiOutlinePicRight style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Blogs
                        </Accordion.Header>
                        <Accordion.Body>
                            <Link style={{ width: "100%" }} to={"/admin/blog"}> Blog list</Link>
                            <Link style={{ width: "100%" }} to={"/admin/blog/add-blog"}> Blog add new</Link>
                        </Accordion.Body>
                    </Accordion.Item>
                </div>
                <Link style={{ width: "100%" }} to={"/admin/contact"}>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>
                            <BsTelephone style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Contacts
                        </Accordion.Header>
                    </Accordion.Item>
                </Link>
                <Link style={{ width: "100%" }} to={"/admin/customer"}>
                    <Accordion.Item eventKey="5">
                        <Accordion.Header>
                            <BiUser style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Customers
                        </Accordion.Header>
                    </Accordion.Item>
                </Link>
                <Link style={{ width: "100%" }} to={"/admin/feedback"}>
                    <Accordion.Item eventKey="6">
                        <Accordion.Header>
                            <BiLogoTelegram style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Feedbacks
                        </Accordion.Header>
                    </Accordion.Item>
                </Link>
            </Accordion>
        </Nav>
    )
}