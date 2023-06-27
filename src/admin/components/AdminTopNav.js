import Nav from 'react-bootstrap/Nav';
import React from 'react';
import { Link } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
export default function AdminTopNav(props) {
    return (
        <Nav
            activeKey="/home"
            onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
            className={"p-3"} style={{
                background: "white",
                borderRadius: "100px",
                position: "sticky",
                top: 0,
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Nav.Item>
                <Link href="/admin">Admin</Link>
            </Nav.Item>
            <Nav.Item style={{}}>
                <Link href="/admin"><CiLogout style={{ marginBottom: 0, marginRight: "10px" }} size="30px" />Logout</Link>
            </Nav.Item>
        </Nav>
    )
}