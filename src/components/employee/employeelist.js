import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Layout,
  Breadcrumb,
  Typography,
  Row,
  Col,
  notification,
  Button,
  Tooltip,
  Table,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
//import Moment from "react-moment";
import { EditOutlined,DotChartOutlined } from "@ant-design/icons";
import SIDERVIEW from "../layout/siderview";
import HEADERVIEW from "../layout/headerview";
import FOOTERVIEW from "../layout/footerview";

function Index() {
  const { Content } = Layout;
  
  var apiurl = localStorage.getItem("session_api");

  const [ds_employee, setds_employee] = React.useState([]);

  const tablecolumns = [
    {
      title: "Action",
      dataIndex: "emp_id",
      key: "emp_id",
      render: (val) => ActionButtonStrip(val),
      
    },

    {
      title: "Employee AD Name",
      dataIndex: "emp_ad",
      key: "emp_ad",
      sorter: (a, b) => a.emp_ad.localeCompare(b.emp_ad),
      sortDirections: ["ascend"],
    },
    {
      title: "Employee  Name",
      dataIndex: "emp_name",
      key: "emp_name",
      sorter: (a, b) => a.emp_name.localeCompare(b.emp_name),
      sortDirections: ["ascend"],
    },
    {
      title: "Employee  Working Hours",
      dataIndex: "emp_whours",
      key: "emp_whours",
      sorter: (a, b) => a.emp_whours.localeCompare(b.emp_whours),
      sortDirections: ["ascend"],
    },

    {
      title: "Employee Active",
      dataIndex: "emp_active",
      key: "emp_active",
      render: (val) => YesNo(val),
    },
  ];

  function YesNo(value) {
    if (value === true) {
      return (
        <Tag color={"green"} key={"Active"}>
          Active
        </Tag>
      );
    } else {
      return (
        <Tag color={"red"} key={"Disable"}>
          Disable
        </Tag>
      );
    }
  }

  function ActionButtonStrip(value) {

    return (
      <>
      <Tooltip title="Edit">
        <Link to={"/editemployee/" + value}>
          <Button shape="circle" type="primary" icon={<EditOutlined />} />
        </Link>
      </Tooltip>
      <Tooltip title="Capacity Heatmap">
        <Link to={"/projectview1/" + value}>
          <Button shape="circle" type="primary" style={{color:"black",backgroundColor:"orangered",borderColor:"orangered"}} icon={<DotChartOutlined />} />
        </Link>
      </Tooltip>
      </>
    );
  }

  React.useEffect(() => {
     
    fetch(`${apiurl}/employee/allemployee`)
      .then((res) => res.json())
      .then((response) => {
        if (response.Type === "SUCCESS") {
          setds_employee(response.Dataset);

          notification["success"]({
            message: "Data Success",
            description: "Data Loaded Successfully.",
            style: {
              color: "#000",
              border: "1px solid #ccffcc",
              backgroundColor: "#99ff66",
            },
          });
        } else {
          notification["error"]({
            message: "Data Error",
            description: "Data Loading Error.",
            style: {
              color: "#000",
              border: "1px solid #ffa39e",
              backgroundColor: "#ff6961",
            },
          });
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Data Error",
          description: error,
          style: {
            color: "#000",
            border: "1px solid #ffa39e",
            backgroundColor: "#ff6961",
          },
        });
      });
  }, [apiurl]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SIDERVIEW />
      <Layout className="site-layout">
        <HEADERVIEW />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <Link to="/allemployee">Employee</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>All Employee</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Row>
              <Col span={24}>
                <Typography.Title level={5} style={{ color: "#6532a8" }}>
                  ALL EMPLOYEE
                </Typography.Title>
                <br />
                <Table dataSource={ds_employee} columns={tablecolumns} />
              </Col>
            </Row>
          </div>
        </Content>
        <FOOTERVIEW />
      </Layout>
    </Layout>
  );
}

export default Index;
