import React, { useEffect, useState } from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import InputGroup from 'react-bootstrap/InputGroup';
import { Col, Form, Row } from 'react-bootstrap';
export default function Dashboard() {

  const [fromDate, setfromDate] = useState('')
  const [toDate, settoDate] = useState('')
  const Currentdate = new Date(); //current date


  function getStatisticNumberOfNMonthAgo(num) {
    //
    let nMonthAgo = new Date();
    nMonthAgo.setMonth(nMonthAgo.getMonth() - num);
    nMonthAgo.setDate(1);
    let nMonthAgoMaxDate = new Date(nMonthAgo.getFullYear(), nMonthAgo.getMonth(), 0);
    //
    console.log(nMonthAgo + ';;;' + nMonthAgoMaxDate);
    return getStatisticNumber(nMonthAgo, nMonthAgoMaxDate)
  }

  const [orders, setOrders] = useState([]); //fetched orders

  useEffect(() => {
    fetch(`http://localhost:9999/order?statusId=4`)
      .then(res => res.json())
      .then(json => setOrders(json));
  }, []
  )

  function getStatisticNumber(from, to) {
    let temp = [...orders];
    temp = temp.filter((o) => (new Date(o.date)) >= (new Date(from)));
    temp = temp.filter((o) => (new Date(o.date)) <= (new Date(to)));
    let data = {
      revenue: 0,
      profit: 0,
      order: temp.length
    }

    temp.map(t => [
      data.revenue += t.totalAmount,
      data.profit += t.productList.map(tp => tp.unitPrice - tp.originalPrice).reduce((a, b) => a + b)
    ]
    )
    return data
  }

  const data = [
    {
      type: "Jan",
      sales: 38,
    },
    {
      type: "Feb",
      sales: 52,
    },
    {
      type: "Mar",
      sales: 61,
    },
    {
      type: "Apr",
      sales: 145,
    },
    {
      type: "May",
      sales: 48,
    },
    {
      type: "Jun",
      sales: 38,
    },
    {
      type: "July",
      sales: 38,
    },
    {
      type: "Aug",
      sales: 38,
    },
    {
      type: "Sept",
      sales: 38,
    },
    {
      type: "Oct",
      sales: 38,
    },
    {
      type: "Nov",
      sales: 38,
    },
    {
      type: "Dec",
      sales: 38,
    },
  ];
  const config = {
    data,
    xField: "type",
    yField: "sales",
    color: ({ type }) => {
      return "#3498db";
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Income",
      },
    },
  };
  return (
    <div>
      <h3 className="mt-2">Dashboard</h3>
      <Row>
        <Col xs={6} md={3}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              From
            </InputGroup.Text>
            <Form.Control type="date" onChange={(e) => { getStatisticNumberOfNMonthAgo(1); setfromDate(e.target.value); getStatisticNumber(fromDate, toDate) }}>

            </Form.Control>
          </InputGroup>
        </Col>
        <Col xs={12} md={3}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              to
            </InputGroup.Text>
            <Form.Control type="date" onChange={(e) => { settoDate(e.target.value); getStatisticNumber(fromDate, toDate) }}>

            </Form.Control>
          </InputGroup>
        </Col>
      </Row>
      <h4>Report on {Date()}</h4>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            {
              //getStatisticNumber((Currentdate.getFullYear() + "-" + Currentdate.getMonth() + "-01" ), (Currentdate.getFullYear() + "-" + Currentdate.getMonth() + "-01" ))
            }
            <p className="desc">Total</p>
            <h4 className="mb-0 sub-title">$1100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6>
              <BsArrowDownRight /> 32%
            </h6>
            <p className="mb-0  desc">Compared To April 2022</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total</p>
            <h4 className="mb-0 sub-title">$1100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="red">
              <BsArrowDownRight /> 32%
            </h6>
            <p className="mb-0  desc">Compared To April 2022</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total</p>
            <h4 className="mb-0 sub-title">$1100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="green">
              <BsArrowDownRight /> 32%
            </h6>
            <p className="mb-0 desc">Compared To April 2022</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-5 title">Income Statics</h3>
        <div>
          <Column {...config} />
        </div>
      </div>
    </div>
  );
}


