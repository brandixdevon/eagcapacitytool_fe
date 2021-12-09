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
  DatePicker,
  Select,
  Button,
  Table,
  Tooltip
} from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import SIDERVIEW from "../layout/siderview";
import HEADERVIEW from "../layout/headerview";
import FOOTERVIEW from "../layout/footerview";
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';

function Index() {
  const { Content } = Layout;
  const { Option } = Select;

  const dateFormat = "YYYY-MM-DD";

  var apiurl = localStorage.getItem("session_api");
 
  const [caldate, setcaldate] = React.useState(new Date());
  const [caldatetype, setcaldatetype] = React.useState("");

  const [ds_dates, setds_dates] = React.useState([]);

  function EditChange(val)
  {
    setcaldate(val);
    setcaldatetype("");
  }

  function ActionButtonStrip(value)
      {
        return (<Tooltip title="Change">
        <Button onClick={()=>EditChange(value)} shape="circle" type="primary" icon={<EditOutlined />} />
      </Tooltip>);
      }

  const tablecolumns = [
    {
      title: 'Action',
      dataIndex: 'cal_date',
      width: '10%',
      key: 'cal_date',
      render: (val) => ActionButtonStrip(val),
    },
    {
      title: "Date",
      dataIndex: "cal_date",
      key: "cal_date",
      sorter: (a, b) => moment(a.cal_date) - moment(b.cal_date),
    },
    {
      title: "Type",
      dataIndex: "cal_datetype",
      key: "cal_datetype",
      sorter: (a, b) => a.cal_datetype.localeCompare(b.cal_datetype),
      filters: [{text: 'Work Day',value: 'Work Day'},{text: 'Weekend',value: 'Weekend'},{text: 'Holiday',value: 'Holiday'}],
      onFilter: (value, record) => record.cal_datetype.indexOf(value) === 0,
    },
  ];

  function onChangeDate(date, dateString) {
    setcaldate(dateString);
  }

  function onChangeType(value) {
    setcaldatetype(value);
  }

  async function addCalendar() {
    if (caldate === "") {
      notification["error"]({
        message: "Data Error",
        description: "Please Select Calendar Date",
        style: {
          color: "#000",
          border: "1px solid #ffa39e",
          backgroundColor: "#ff6961",
        },
      });
    } else if (caldatetype === "") {
      notification["error"]({
        message: "Data Error",
        description: "Please Enter Date Type.",
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
        body: JSON.stringify({ caldate: caldate, caldatetype: caldatetype }),
      };

      await fetch(`${apiurl}/calendar/calendarmaintain`, sendOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.Type === "SUCCESS") {
            setcaldatetype("");

            fetch(`${apiurl}/calendar/allcalendar`)
      .then((res) => res.json())
      .then((response) => {
        if (response.Type === "SUCCESS") {

          setds_dates(response.Dataset);

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

  React.useEffect(() => {
     
    fetch(`${apiurl}/calendar/allcalendar`)
      .then((res) => res.json())
      .then((response) => {
        if (response.Type === "SUCCESS") {

          setds_dates(response.Dataset);

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
              <Link to="/calendarfullview">Calendar</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Add/Change Calendar</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Row>
              <Col span={4}>
                <Typography.Title level={5} style={{ color: "#6532a8" }}>
                  ADD-CHANGE DATE
                </Typography.Title>
                <br />
                <br />
                <Typography.Text style={{ color: "blue" }}>
                  Select Date :
                </Typography.Text>
                <br />
                <DatePicker value={moment(caldate, dateFormat)} format={dateFormat} onChange={onChangeDate} size="large" />
                <br />
                <br />
                <Typography.Text style={{ color: "blue" }}>
                  Date Type :
                </Typography.Text>
                <br />
                <Select
                  style={{ width: 150 }}
                  onChange={onChangeType}
                  value={caldatetype}
                >
                  <Option value="Work Day">Work Day</Option>
                  <Option value="Weekend">Weekend</Option>
                  <Option value="Holiday">Holiday</Option>
                </Select>
                <br />
                <br />
                <Button
                  onClick={addCalendar}
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  Update Calendar
                </Button>
              </Col>
              <Col span={20}>
                  <Table dataSource={ds_dates} columns={tablecolumns} pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50']}}/>
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
