import React from "react";
import { Outlet } from "react-router-dom";
import AdminSideNav from "../components/AdminSideNav";
import AdminFooter from "../components/AdminFooter.js";
import { Col, Container, Row } from "react-bootstrap";
import AdminTopNav from "../components/AdminTopNav";
const DefaultAdminLayout = () => {
  return (
    <>
      <Row style={{ background: "#e5f3ff" , margin: 0}}>
        <Col lg={2} style={{paddingLeft:0}}>
          <AdminSideNav className={"p-2 flex-column row"} />
        </Col>
        <Col lg={10}>
          <AdminTopNav/>
          <Outlet />
          <AdminFooter />
        </Col>
      </Row>
    </>
  );
};

export default DefaultAdminLayout;