import React from "react";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col, Form, Row, Table } from 'react-bootstrap';
import Paginate from '../components/Paginate';
import InputGroup from 'react-bootstrap/InputGroup';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { AiFillCaretRight } from "react-icons/ai";
import { date } from "yup";


export default function Orders() {

  const [orders, setOrders] = useState([]); //fetched orders
  const [status, setStatus] = useState([]); //fetched status
  const [lgShow, setLgShow] = useState(false); //modal
  const effectBadge = ["warning", "warning", "primary", "success", "danger"]; // each status has it badge
  const colorBadge = ["#9ea954db", "#9ea954db", "#3876a9", "#248e5cd6", "#7c3c3cd6"];  // each status has it color
  const [currentDetail, setCurrentDetail] = useState([]);

  //for filtering
  const [statusFilter, setStatusFilter] = useState('')
  const [orderIdFilter, setOrderIdFilter] = useState('')
  const [fromDate, setfromDate] = useState('')
  const [toDate, settoDate] = useState('')

  const [refresh, setRefresh] = useState(true)
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  //

  useEffect(
    () => {
      fetch(`http://localhost:9999/status`)
        .then(res => res.json())
        .then(json => {
          setStatus(json)
        }
        );
    }, []
  );

  const openDetail = (index) => {
    // fetch(`http://localhost:9999/order/` + id)
    //   .then(res => res.json())
    //   .then(json => {
    //     setCurrentDetail(json)
    //   }
    //   );
    setCurrentDetail(orders[index])
  }

  useEffect(() => { //filter with status, order id
    filterOrder(currentPage);
  }, [currentPage, orderIdFilter, statusFilter, fromDate, toDate, refresh]
  )

  const filterOrder = (page) => {
    var url = (`http://localhost:9999/order/?_sort=id&_order=desc`);

    if (fromDate === '' && toDate === '') url += `&_page=${page}&_limit=10`;

    if (statusFilter !== '') {
      url += ('&statusId=' + statusFilter)
    }
    if (orderIdFilter !== '') {
      url += ('&id=' + orderIdFilter)
    }

    fetch(url)
      .then(res => {
        const totalCount = res.headers.get('X-Total-Count');
        setTotalPages(Math.ceil(totalCount / 10));
        return res.json();
      }
      )
      .then(json => {
        setOrders(json)
        if (fromDate !== '') {
          let temp = [...json];
          temp = temp.filter((o) => (new Date(o.date)) >= (new Date(fromDate)));
          setOrders(temp);
        }
        if (toDate !== '') {
          let temp = [...json];
          temp = temp.filter((o) => new Date(o.date) <= new Date(toDate));
          setOrders(temp);
        }
      })
      .catch((err) => toast.error(err));
  }

  // useEffect(() => {  //date filtering
  //     if(fromDate !== ''){
  //       let temp = [...orders];
  //       temp = temp.filter((o) => (new Date(o.date)) >= (new Date(fromDate)));
  //       setOrders(temp);
  //       console.log(temp)
  //     }
  //     if(toDate !== ''){
  //       let temp = [...orders];
  //       temp = temp.filter((o) => new Date(o.date) <= new Date(toDate));
  //       setOrders(temp);
  //     }
  // }, [fromDate, toDate]
  // )

  const updateStatus = (value, index, id) => {   //index is index of orders in orders useState , id is its order id
    fetch('http://localhost:9999/order/' + id, {
      method: 'PUT',
      body: JSON.stringify({
        ...orders[index],
        statusId: Number(value)
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(setRefresh(!refresh))
  }

  return (
    <Col lg={10}>
      <h3 className="mt-2">Orders</h3>
      <Row className='my-4'>
        <Col xs={6} md={2}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              Status
            </InputGroup.Text>
            <Form.Select onChange={(e) => setStatusFilter(e.target.value)}>
              <option value={''}>
                all
              </option>
              {status?.map((s) =>
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              )}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs={6} md={2}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              Order id
            </InputGroup.Text>
            <Form.Control onChange={(e) => setOrderIdFilter(e.target.value)}>

            </Form.Control>
          </InputGroup>
        </Col>
        <Col xs={12} md={2}>
        </Col >
        <Col xs={6} md={3}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              From
            </InputGroup.Text>
            <Form.Control type="date" onChange={(e) => setfromDate(e.target.value)}>

            </Form.Control>
          </InputGroup>
        </Col>
        <Col xs={12} md={3}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              to
            </InputGroup.Text>
            <Form.Control type="date" onChange={(e) => settoDate(e.target.value)}>

            </Form.Control>
          </InputGroup>
        </Col>
        <Col xs={12} md={12}>
          <div className="pagination mb-3 justify-content-end">
            <Paginate
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          </div>
        </Col>
      </Row>
      {
        orders.map((o, index) =>
          <div key={index} className="m-2 mb-4">
            <Card className="m-2" style={{ background: colorBadge[o.statusId - 1] }}>
              <Card.Header className="row">
                <div className="col-1">
                  <div style={{ color: "white" }}>ID: {o.id}</div>
                </div>
                <div className="col-1">
                  <Badge bg={effectBadge[o.statusId - 1]}>{status[o.statusId - 1]?.name}</Badge>
                </div>
                <div className="col-3">
                  <p style={{ color: "white" }}>Create date: {new Date(o.date).toLocaleString()}</p>
                </div>
                <div className="col-4">

                </div>
                <div className="col-3">
                  <InputGroup>
                    <InputGroup.Text>
                      Change status
                    </InputGroup.Text>
                    <Form.Select value={o.statusId} onChange={(e) => updateStatus(e.target.value, index, o.id)}>
                      {status?.map((s) =>
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      )}
                    </Form.Select>
                  </InputGroup>
                </div>
              </Card.Header>
              <Card.Body className="row m-1" style={{ background: "white" }}>
                <Card.Title className="col-3">
                  {o.name} <br></br>
                  (+1) {o.phone}
                </Card.Title>
                <Card.Text className="col-5">
                  {'zipcode: ' + o.address?.zipcode + ', ' + o.address?.detailAddress + ', ' + o.address?.city + ", " + o.address?.state + ', ' + o.address?.country}
                </Card.Text>
                <Card.Text className="col-2">
                  {o.productList?.length} x products
                </Card.Text>
                <Card.Text className="col-2">
                  $ {o.totalAmount}
                </Card.Text>
                <Button onClick={() => { setLgShow(true); openDetail(index) }} className="btn-light btn-outline-dark">Detail</Button>
              </Card.Body>
            </Card>
          </div>
        )
      }
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Order id: {currentDetail.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="m-2">
            <Card.Header style={{ background: colorBadge[currentDetail.statusId - 1] }}><div style={{ color: "white" }}>Status</div> <Badge bg={effectBadge[currentDetail.statusId - 1]}>{status[currentDetail.statusId - 1]?.name}</Badge></Card.Header>
            <Card.Body>
              <Card.Title>
                {currentDetail.name} <br></br>
                (+1) {currentDetail.phone}
              </Card.Title>
              <Card.Text>
                {'zipcode: ' + currentDetail.address?.zipcode + ', ' + currentDetail.address?.detailAddress + ', ' + currentDetail.address?.city + ", " + currentDetail.address?.state + ', ' + currentDetail.address?.country}
              </Card.Text>
              <Card.Text>
                {currentDetail.productList?.length} x products
              </Card.Text>
              <Card.Text>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Product ID</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDetail?.productList?.map((p, index) =>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td><button onClick={() => { window.location = `/product/${p.productId}` }} type='button' style={{ minWidth: "10ch" }} className='btn btn-dark'>{p.productId} <AiFillCaretRight className='m-0' /></button></td>
                        <td>{p.productName}</td>
                        <td>{p.quantity}</td>
                        <td>{Number(p.unitPrice) * p.quantity}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Text>
              <Card.Text>
                <p style={{ fontWeight: "bold" }}>Total:</p>
                <p style={{ fontWeight: "bold" }}>$ {currentDetail.totalAmount}</p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </Col>
  )
}
