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
import Moment from "react-moment";
import { EditOutlined,DiffOutlined } from "@ant-design/icons";
import SIDERVIEW from "../layout/siderview";
import HEADERVIEW from "../layout/headerview";
import FOOTERVIEW from "../layout/footerview";

function Index() {
  const { Content } = Layout;
  
  var apiurl = localStorage.getItem("session_api");

  const [ds_projects, setds_projects] = React.useState([]);

  const tablecolumns = [
    {
      title: "Action",
      dataIndex: "pro_id",
      key: "pro_id",
      render: (val) => ActionButtonStrip(val),
    },
    {
      title: "Project Name",
      dataIndex: "pro_name",
      key: "pro_name",
      sorter: (a, b) => a.pro_name.localeCompare(b.pro_name),
      sortDirections: ["ascend"],
    },
    {
      title: "Project Start",
      dataIndex: "pro_start",
      key: "pro_start",
      render: (val) => ConvertToDate(val),
    },
    {
      title: "Project End",
      dataIndex: "pro_end",
      key: "pro_end",
      render: (val) => ConvertToDate(val),
    },
    {
      title: "Project Status",
      dataIndex: "pro_status",
      key: "pro_status",
      filters: [
        {
          text: "Ongoing",
          value: "Ongoing",
        },
        {
          text: "Onhold",
          value: "Onhold",
        },
        {
          text: "Finished",
          value: "Finished",
        },
        {
          text: "Cancelled",
          value: "Cancelled",
        },
      ],
      onFilter: (value, record) => record.pro_status.indexOf(value) === 0,
    },
    {
      title: "Project Active",
      dataIndex: "pro_active",
      key: "pro_active",
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

  function ConvertToDate(value) {
    return <Moment format="YYYY-MMM-DD">{value}</Moment>;
  }
  function ActionButtonStrip(value) {
    return (
      <>
      <Tooltip title="Edit">
        <Link to={"/editproject/" + value}>
          <Button shape="circle" type="primary" icon={<EditOutlined />} />
        </Link>
      </Tooltip>
      <Tooltip title="Tasks Assign">
        <Link to={"/addtask/" + value}>
          <Button shape="circle" style={{backgroundColor:"orange",borderColor:"orange",color:"black"}} icon={<DiffOutlined />} />
        </Link>
      </Tooltip>
      </>
    );
  }

  React.useEffect(() => {
    fetch(`${apiurl}/projects/allprojects`)
      .then((res) => res.json())
      .then((response) => {
        if (response.Type === "SUCCESS") {
          setds_projects(response.Dataset);

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
              <Link to="/allprojects">Projects</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>All Projects</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Row>
              <Col span={24}>
                <Typography.Title level={5} style={{ color: "#6532a8" }}>
                  ALL PROJECT
                </Typography.Title>
                <br />
                <Table dataSource={ds_projects} columns={tablecolumns} />
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
