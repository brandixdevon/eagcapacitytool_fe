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
  Tooltip,
  Input,
  Switch,
  Modal,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import SIDERVIEW from "../layout/siderview";
import HEADERVIEW from "../layout/headerview";
import FOOTERVIEW from "../layout/footerview";
import moment from 'moment';
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
import ReactExport from "@ibrahimrahmani/react-export-excel";
 
function Index() {
  const { Content } = Layout;
  const { Option } = Select;

  const dateFormat = "YYYY-MM-DD";

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  var apiurl = localStorage.getItem("session_api");
  var empid = localStorage.getItem("session_sys_empid");

  const [caldate, setcaldate] = React.useState(new Date());

  const [ds_alltasks, setds_alltasks] = React.useState([]);
  
  async function EditChange(val)
  {
    
  }

  function HourConvert(value)
      {
        var lastno = value.split('.').reverse()[0];
        var firstno = value.split('.').reverse()[1];
        var joinvalue = value;

        if(lastno === "00")
        {
          joinvalue = firstno + ".00";
        }
        else if(lastno === "25")
        {
          joinvalue = firstno + ".15";
        }
        else if(lastno === "50")
        {
          joinvalue = firstno + ".30";
        }
        else if(lastno === "75")
        {
          joinvalue = firstno + ".45";
        }

        return joinvalue;
      }


  const tablecolumns = [
    {
      title: 'Action',
      dataIndex: 'task_id',
      width: '10%',
      key: 'task_id',
    },
    {
      title: 'Responsible',
      dataIndex: 'emp_name',
      key: 'emp_name',
      sorter: (a, b) => a.emp_name.localeCompare(b.emp_name),
    },
    {
        title: 'Title',
        dataIndex: 'task_title',
        key: 'task_title',
        sorter: (a, b) => a.task_title.localeCompare(b.task_title),
    },
    {
        title: 'Date',
        dataIndex: 'task_date',
        key: 'task_date',
        sorter: (a, b) => a.task_date.localeCompare(b.task_date),
    },
    {
        title: 'Duration',
        dataIndex: 'task_hours',
        key: 'task_hours',
        render: (val) => HourConvert(val),
        sorter: (a, b) => a.task_hours.localeCompare(b.task_hours),
    },
    {
        title: 'Status',
        dataIndex: 'task_status',
        key: 'task_status',
        sorter: (a, b) => a.task_status.localeCompare(b.task_status),
        filters: [{text: 'Open',value: 'Open'},{text: 'Hold',value: 'Hold'},{text: 'Completed',value: 'Completed'}],
        onFilter: (value, record) => record.task_status.indexOf(value) === 0,
    }
  ];

  function onChangeDate(date, dateString) {
    setcaldate(dateString);
  }


  React.useEffect(() => {

    fetch(`${apiurl}/employee/allactiveemployees`)
      .then((res) => res.json())
      .then((response) => {
        if (response.Type === "SUCCESS") {

            setds_alltasks(response.Dataset);

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
              <Link to="/allprojects">Daily Tasks</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Row>
              <Col span={24}>
              <Typography.Text style={{ color: "blue" }}>
                  Target Date :
                </Typography.Text>
                <br />
                <DatePicker value={moment(caldate, dateFormat)} format={dateFormat} onChange={onChangeDate} size="medium" />
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
