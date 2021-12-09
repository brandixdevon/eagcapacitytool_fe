import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Layout,
  Breadcrumb,
  Typography,
  Input,
  Row,
  Col,
  notification,
  Button,
} from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import SIDERVIEW from "../layout/siderview";
import HEADERVIEW from "../layout/headerview";
import FOOTERVIEW from "../layout/footerview";

function Index() {
  const { Content } = Layout;
  
  var apiurl = localStorage.getItem("session_api");

  const [empad, setempad] = React.useState("");
  const [empname, setempname] = React.useState("");
  const [emphours, setempwhours] = React.useState("0");

  function onChangeEmpad(e) {
    setempad(e.target.value);
  }

  function onChangeEmpName(e) {
    setempname(e.target.value);
  }

  function onChangeWhours(e) {
    setempwhours(e.target.value);
  }

  function addemployee() {
   
    if (empad === "") {
      notification["error"]({
        message: "Data Error",
        description: "Please Enter Employee AD Name.",
        style: {
          color: "#000",
          border: "1px solid #ffa39e",
          backgroundColor: "#ff6961",
        },
      });
    } else if (empname === "") {
      notification["error"]({
        message: "Data Error",
        description: "Please Enter Employee Name.",
        style: {
          color: "#000",
          border: "1px solid #ffa39e",
          backgroundColor: "#ff6961",
        },
      });
    } else if (emphours === "") {
      notification["error"]({
        message: "Data Error",
        description: "Please Enter Employee Working Hours.",
        style: {
          color: "#000",
          border: "1px solid #ffa39e",
          backgroundColor: "#ff6961",
        },
      });
    } else {
      
      
      const sendOptions = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empad: empad,
          empname: empname,
          empwhours: emphours,
        }),
      };
      
     fetch(`${apiurl}/employee/addemployee`, sendOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.Type === "SUCCESS") {
            setempad("");
            setempname("");
            setempwhours(0);

            notification["success"]({
              message: "Data Success",
              description: data.Msg,
              style: {
                color: "#000",
                border: "1px solid #ccffcc",
                backgroundColor: "#99ff66",
              },
            });
          }

          if (data.Type === "ERROR") {
            localStorage.clear();
            notification["error"]({
              message: "Data Error",
              description: data.Msg,
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
    }
  }

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
            <Breadcrumb.Item>New Employee</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Row>
              <Col span={12}>
                <Typography.Title level={5} style={{ color: "#6532a8" }}>
                  ADD NEW EMPLOYEE
                </Typography.Title>
                <br />
                <Typography.Text style={{ color: "blue" }}>
                Employee AD Name : (DevonP)
                </Typography.Text>
                <br />
                <Input
                  required={true}
                  size="medium"
                  value={empad}
                  onChange={onChangeEmpad}
                />
                <br />
                <br />
                <Typography.Text style={{ color: "blue" }}>
                  Employee Name : (Devon)
                </Typography.Text>
                <br />
                <Input
                  required={true}
                  size="medium"
                  value={empname}
                  onChange={onChangeEmpName}
                />
                <br />
                <br />
                <Typography.Text style={{ color: "blue" }}>
                  Employee Working Hours :
                </Typography.Text>
                <br />
                <Input
                  required={true}
                  size="medium"
                  value={emphours}
                  onChange={onChangeWhours}
                />
                <br />
                <br />
                <Button
                  onClick={addemployee}
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  Add New employee
                </Button>
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
