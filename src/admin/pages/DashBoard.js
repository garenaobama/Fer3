import React, { useEffect, useState } from "react";
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";
import { Line, Pie, DualAxes } from "@ant-design/plots"
import InputGroup from 'react-bootstrap/InputGroup';
import { Button, Col, Form, Row } from 'react-bootstrap';

export default function Dashboard() {
  const Currentdate = new Date(); //current date
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  //for query statistic
  const [fromDate, setfromDate] = useState('')
  const [toDate, settoDate] = useState('')
  //

  //for yealy report
  const [yearlySelected, setYearlySelected] = useState(Currentdate.getFullYear())
  // 

  //for selected month report
  const [selectedMonth, setSelectedMonth] = useState(Currentdate.getMonth())
  const [selectedYear, setSelectedYear] = useState(Currentdate.getFullYear())
  const [selectedDate, setSelectedDate] = useState(new Date(Currentdate.getFullYear() + '-' + (Currentdate.getMonth() + 1) + '-01'))
  //

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]); //fetched orders
  useEffect(() => {
    fetch(`http://localhost:9999/order?statusId=4`)
      .then(res => res.json())
      .then(json => setOrders(json));

    fetch(`http://localhost:9999/brands`)
      .then((res) => res.json())
      .then((json) => setBrands(json));

    fetch(`http://localhost:9999/categories`)
      .then((res) => res.json())
      .then((json) => setCategories(json));
  }, []
  )

  const getStatisticNumber = (from, to) => {
    let temp = [...orders];
    temp = temp.filter((o) => (new Date(o.date)) >= (new Date(from)));
    temp = temp.filter((o) => (new Date(o.date)) < (new Date(to)));
    var ok = [];
    temp.map(t => t.productList.map(tp => [ok.push(tp.quantity)]))
    let data = {
      from: from,
      to: to,
      revenue: 0,
      profit: 0,
      totalQuantity: ok.length >0 && ok?.reduce((a, b) => a + b),
      order: temp.length,
      category: categories.map(c => ({ name: c.name, id: c.id, quantity: 0, profit: 0, revenue: 0 })),
      brand: brands.map(b => ({ name: b.name, id: b.id, quantity: 0, profit: 0, revenue: 0 }))
    }
    data.brand.length > 0 && data.category.length > 0 && temp.map(t => [
      data.revenue += t.totalAmount,
      data.profit += t.productList.map(tp => (tp.unitPrice - tp.originalPrice) * tp.quantity).reduce((a, b) => a + b),
      t.productList.map(tp => [
        // console.log(...data.category.map((c,index) => c.id == tp.categoryId ? index : '' ).filter(c=> c != ''))
        data.category.map((c, index) => index + 1 == tp.categoryId ? [c.quantity += tp.quantity] : []),
        data.category.map((c, index) => index + 1 == tp.categoryId ? [c.profit += (tp.unitPrice - tp.originalPrice) * tp.quantity] : []),
        data.category.map((c, index) => index + 1 == tp.categoryId ? [c.revenue += tp.originalPrice * tp.quantity] : []),
        data.brand.map((c, index) => index + 1 == tp.brandId ? [c.quantity += tp.quantity] : []),
        data.brand.map((c, index) => index + 1 == tp.brandId ? [c.profit += (tp.unitPrice - tp.originalPrice) * tp.quantity] : []),
        data.brand.map((c, index) => index + 1 == tp.brandId ? [c.revenue += tp.originalPrice * tp.quantity] : [])
      ]
      )
    ]
    )
    return data
  }

  const currentMonthReport = () => getStatisticNumber(dateArrayByYear(selectedYear)[selectedMonth][0], dateArrayByYear(selectedYear)[selectedMonth][1]);
  const pre_currentMonthReport = () => getStatisticNumber(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1), new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0));
  
  useEffect(() => {
    setSelectedDate(new Date(selectedYear + '-' + (Number(selectedMonth) + 1) + '-01'))
  }, [selectedMonth, selectedYear]
  )

  const [dataForYearly, setDataForYearly] = useState(dateArrayByYear(yearlySelected).map(a => getStatisticNumber(a[0], a[1])));

  //category yearly
  const getTotalYearlyCategory = (year) => { //get total of a year for pie chart
    let arr = dateArrayByYear(year);
    return getStatisticNumber(arr[0][0], arr[11][1]).category
  }
  const getDataYearlyCategory = () => {
    let dataYearlyCategory = dataForYearly.map(d => d.category.map(dc => ({ ...dc, to: d.to })))
    let ak = [];
    dataYearlyCategory.map(d => [ak.push(...d)])
    return ak
  }
  //

  //brand yearly
  const getTotalYearlyBrand= (year) => { //get total of a year for pie chart
    let arr = dateArrayByYear(year);
    return getStatisticNumber(arr[0][0], arr[11][1]).brand
  }
  const getDataYearlyBrand = () => {
    let dataYearlyBrand = dataForYearly.map(d => d.brand.map(dc => ({ ...dc, to: d.to })))
    let ak = [];
    dataYearlyBrand.map(d => [ak.push(...d)])
    return ak
  }
  //

  useEffect(() => {
    setDataForYearly(dateArrayByYear(yearlySelected).map(a => getStatisticNumber(a[0], a[1])));
  }, [yearlySelected, orders, brands, categories]
  )
  console.log(dataForYearly)
  //
  return (
    <div>
      <h3 className="mt-2">Dashboard</h3>
      <Row>
        <Col xs={6} md={3}>
          <h4>Report on {monthNames[selectedMonth] + " " + selectedYear}</h4>
        </Col>
        <Col xs={6} md={2}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              Month
            </InputGroup.Text>
            <Form.Select type="date" value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); console.log(selectedDate) }}>
              {monthNames.map((m, index) => <option key={index} value={index}>{m}</option>)}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs={12} md={2}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              Year
            </InputGroup.Text>
            <Form.Control type="year" value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value) }}>

            </Form.Control>
          </InputGroup>
        </Col>
        <Col xs={12} md={3}>
          <Button onClick={() => { setSelectedMonth(Currentdate.getMonth()); setSelectedYear(Currentdate.getFullYear()) }} variant="primary">Back to present</Button>
          <Button onClick={selectedMonth > 0 ? () => { setSelectedMonth(selectedMonth - 1) } : () => { setSelectedMonth(11); setSelectedYear(selectedYear - 1) }} variant="danger">Previous month</Button>
        </Col>
      </Row>
      <div className="d-flex justify-content-between align-items-center gap-3 mt-4">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total revenue</p>
            <h4 className="mb-0 sub-title">${currentMonthReport().revenue.toFixed(2)}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6>
              {(currentMonthReport().revenue / pre_currentMonthReport().revenue * 100 - 100) >= 0 ? <div style={{ color: "green" }}><AiOutlineRise size={25} className="m-0" /> {'+' + (currentMonthReport().revenue / pre_currentMonthReport().revenue * 100 - 100).toFixed(2) + '%'}</div> : <div style={{ color: "red" }}><AiOutlineFall size={25} className="m-0" /> {(currentMonthReport().revenue / pre_currentMonthReport().revenue * 100 - 100).toFixed(2) + '%'}</div>}
            </h6>
            <p className="mb-0  desc">Compared to {monthNames[pre_currentMonthReport().from.getMonth()] + " " + pre_currentMonthReport().from.getFullYear()}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total profit</p>
            <h4 className="mb-0 sub-title">${currentMonthReport().profit.toFixed(2)}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6>
              {(currentMonthReport().profit / pre_currentMonthReport().profit * 100 - 100) >= 0 ? <div style={{ color: "green" }}><AiOutlineRise size={25} className="m-0" /> {'+' + (currentMonthReport().profit / pre_currentMonthReport().profit * 100 - 100).toFixed(2) + '%'}</div> : <div style={{ color: "red" }}><AiOutlineFall size={25} className="m-0" /> {(currentMonthReport().profit / pre_currentMonthReport().profit * 100 - 100).toFixed(2) + '%'}</div>}
            </h6>
            <p className="mb-0  desc">Compared to {monthNames[pre_currentMonthReport().from.getMonth()] + " " + pre_currentMonthReport().from.getFullYear()}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total orders</p>
            <h4 className="mb-0 sub-title">{currentMonthReport().order}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6>
              {(currentMonthReport().order / pre_currentMonthReport().order * 100 - 100) >= 0 ? <div style={{ color: "green" }}><AiOutlineRise size={25} className="m-0" /> {'+' + (currentMonthReport().order / pre_currentMonthReport().order * 100 - 100).toFixed(2) + '%'}</div> : <div style={{ color: "red" }}><AiOutlineFall size={25} className="m-0" /> {(currentMonthReport().order / pre_currentMonthReport().order * 100 - 100).toFixed(2) + '%'}</div>}
            </h6>
            <p className="mb-0  desc">Compared to {monthNames[pre_currentMonthReport().from.getMonth()] + " " + pre_currentMonthReport().from.getFullYear()}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6 col-xl-4"><DemoPie data={currentMonthReport().category} spec="revenue"></DemoPie></div>
        <div className="col-12 col-lg-6 col-xl-4"><DemoPie data={currentMonthReport().category} spec="profit"></DemoPie></div>
        <div className="col-12 col-lg-6 col-xl-4"><DemoPie data={currentMonthReport().category} spec="quantity"></DemoPie></div>
      </div>

      <div className="mt-5">
        <h3 className="mb-5 title">Yearly statistic {yearlySelected}</h3>
        <Row>
          <Col xs={6} md={3}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                Year
              </InputGroup.Text>
              <Form.Control type="year" value={yearlySelected} onChange={(e) => { setYearlySelected(e.target.value) }}>

              </Form.Control>
            </InputGroup>
          </Col>
          <Col xs={12} md={3}>
            <Button variant="primary">Jump to current year</Button>
          </Col>
        </Row>
        <div className="row m-5">
          <div className="col-12 col-lg-6"><h4>Revenue and profit</h4><DemoDualAxes data={dataForYearly} /></div>
          <div className="col-12 col-lg-6"><h4>Orders and products sold</h4><OrderDualAxes data={dataForYearly} /></div>
        </div>
      </div>
      <div className="mt-5">
        <div className="row m-5">
        <h4>Category </h4>
          <div className="col-12 col-lg-6 col-xl-8"><DemoLine data={getDataYearlyCategory()} ></DemoLine></div>
          <div className="col-12 col-lg-6 col-xl-4"><DemoPie data={getTotalYearlyCategory(yearlySelected)} spec="revenue"></DemoPie></div>
        </div>
      </div >
      <div className="mt-5">
        <div className="row m-5">
        <h4>Brand </h4>
          <div className="col-12 col-lg-6 col-xl-8"><DemoLine data={getDataYearlyBrand()}></DemoLine></div>
          <div className="col-12 col-lg-6 col-xl-4"><DemoPie data={getTotalYearlyBrand(yearlySelected)} spec="revenue"></DemoPie></div>
        </div>
      </div>
    </div >
  );
}

const DemoPie = (props) => {
  const { data, spec } = props
  const config = {
    appendPadding: 10,
    data,
    theme: "light",
    angleField: spec,
    colorField: "name",
    radius: 0.8,
    innerRadius: 0.64,
    meta: {
      [spec]: {
        formatter: (v) => spec != 'quantity' ? `$${v?.toFixed(2)}` : v,
      }
    },
    label: {
      type: "inner",
      offset: "-50%",
      autoRotate: false,
      style: {
        textAlign: "center",
        fill: "#fff"
      },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    interactions: [
      {
        type: "element-selected"
      },
      {
        type: "element-active"
      }
    ],
    statistic: {
      title: {
        formatter: (v) => spec != 'quantity' ? spec.charAt(0).toUpperCase() + spec.slice(1) : 'Products sold',
        offsetY: -8,
        style: {
          color: "#000"
        }
      },
      content: {
        style: {
          color: "#000",
          fontSize: "1rem",
        },
        offsetY: -4
      }
    },
    pieStyle: {
      lineWidth: 0
    }
  };
  return <Pie {...config} />;
};
const DemoLine = (props) => {
  const { data } = props
  const config = {
    data,
    autoFit: false,
    xField: 'to',
    yField: 'revenue',
    seriesField: 'name',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };
  return <Line {...config} />;
}

const OrderDualAxes = (props) => {
  const { data } = props;
  const config = {
    data: [data, data],
    xField: 'to',
    yField: ['order', 'totalQuantity'],
    geometryOptions: [
      {
        geometry: 'column',
      },
      {
        geometry: 'line',
        point: {
          size: 5,
          shape: 'diamond',
        },
        lineStyle: {
          lineWidth: 2,
        },
      }
    ],
  };
  return <DualAxes {...config} />;
};
const DemoDualAxes = (props) => {
  const { data } = props;
  const config = {
    data: [data, data],
    xField: 'to',
    yField: ['revenue', 'profit'],
    geometryOptions: [
      {
        geometry: 'column',
      },
      {
        geometry: 'line',
        point: {
          size: 5,
          shape: 'diamond',
        },
        lineStyle: {
          lineWidth: 2,
        },
      }
    ],
  };
  return <DualAxes {...config} />;
};

// This will output an array of 12 periods of time from January to December of the year 2023
const dateArrayByYear = (year) => {
  var arr = [];
  for (let i = 0; i < 12; i++) {
    var start = new Date(year, i, 2);
    var end = new Date(year, i + 1, 1);
    arr.push([start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]);
  }
  return arr;
}

//console.log(dateArrayByYear(2024))
