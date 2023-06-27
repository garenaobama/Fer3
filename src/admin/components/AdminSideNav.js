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
                <img style={{ width: "70%" }} src={logo} alt='logo'></img>
            </Link>
            <div className='mt-3 mb-3' style={{ width: "100%", height: "2px", background: "#00000038" }}></div>

            <Link className='mb-3 p-2' style={location.pathname === '/admin/dashboard' ? {width:"100%", background:"#e0e0e0"} : {width:"100%"}} to={"/admin/dashboard"}><AiOutlineStock size="30px" style={{ marginBottom: 0, marginRight: "10px" }} />Dashboard</Link>
            
            <Link className='mb-3 p-2' style={location.pathname === '/admin/order' ? {width:"100%", background:"#e0e0e0"} : {width:"100%"}}  to={"/admin/order"}><AiOutlineShopping style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Orders</Link>

            <Link className='mb-3 p-2' style={location.pathname === '/admin/product' ? {width:"100%", background:"#e0e0e0"} : {width:"100%"}}  to={"/admin/product"}><AiOutlineShoppingCart style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Products</Link>

            <Link className='mb-3 p-2' style={location.pathname === '/admin/blog' ? {width:"100%", background:"#e0e0e0"} : {width:"100%"}}  to={"/admin/blog"}><AiOutlinePicRight style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Blogs</Link>

            <Link className='mb-3 p-2' style={location.pathname === '/admin/contact' ? {width:"100%", background:"#e0e0e0"} : {width:"100%"}}  to={"/admin/contact"} ><BsTelephone style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Contacts</Link>

            <Link className='mb-3 p-2' style={location.pathname === '/admin/customer' ? {width:"100%", background:"#e0e0e0"} : {width:"100%"}}  to={"/admin/customer"}><BiUser style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Customers</Link>

            <Link className='mb-3 p-2' style={location.pathname === '/admin/feedback' ? {width:"100%", background:"#e0e0e0"} : {width:"100%"}} to={"/admin/feedback"}><BiLogoTelegram style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Feedbacks</Link>

        </Nav>
    )
}