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
import { EditOutlined,DeleteOutlined,PlusCircleOutlined } from '@ant-design/icons';
import ReactExport from "@ibrahimrahmani/react-export-excel";
 
function Index() {
  const { Content } = Layout;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;

  const dateFormat = "YYYY-MM-DD";

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  var apiurl = localStorage.getItem("session_api");
  var session_user = localStorage.getItem("session_sys_uid");

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const [url_proid] = React.useState(window.location.href.split('/').reverse()[0]);
  const [proname , setproname] = React.useState("");

  const [selectemp, setselectemp] = React.useState("");
  const [selecthours, setselecthours] = React.useState("");
  const [caldate, setcaldate] = React.useState(new Date());
  const [rangedate_from, setrangedate_from] = React.useState(new Date());
  const [rangedate_to, setrangedate_to] = React.useState(new Date());
  const [isdr_active, setisdr_active] = React.useState(false);
  const [tasktitle, settasktitle] = React.useState("");
  const [taskdesc, settaskdesc] = React.useState("");

  const [taskid_edit, settaskid_edit] = React.useState("");
  const [selectemp_edit, setselectemp_edit] = React.useState(0);
  const [selecthours_edit, setselecthours_edit] = React.useState("");
  const [caldate_edit, setcaldate_edit] = React.useState(new Date());
  const [tasktitle_edit, settasktitle_edit] = React.useState("");
  const [taskdesc_edit, settaskdesc_edit] = React.useState("");
  const [taskstatus_edit, settaskstatus_edit] = React.useState("");
 
  const [ds_project, setds_project] = React.useState([]);
  const [ds_allemp, setds_allemp] = React.useState([]);
  const [ds_alltasks, setds_alltasks] = React.useState([]);
  

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
      render: (val) => ActionButtonStrip(val),
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

    async function addtask()
    {
        if(selectemp === "")
        {
          notification['error']({
            message: 'Data Error',
            description: 'Please Select Employee.',
            style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
          });
          return;
        }

        if(selecthours === "")
        {
          notification['error']({
            message: 'Data Error',
            description: 'Please Select Allocated Hours and Minutes.',
            style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
          });
          return;
        }

        if(tasktitle === "")
        {
          notification['error']({
            message: 'Data Error',
            description: 'Please Enter Task Title.',
            style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
          });
          return;
        }
 
        if(isdr_active === false)
        {
          if(caldate === "")
          {
            notification['error']({
              message: 'Data Error',
              description: 'Please Select Date.',
              style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
            });
            return;
          }
          else
          {
            const sendOptions = {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({"cruser": session_user ,"empid" : selectemp , "proid" : url_proid, "taskdate" : caldate, "taskdesc" : taskdesc, "taskhours" : selecthours, "tasktitle" : tasktitle})
            };

            await fetch(`${apiurl}/task/addtask`,sendOptions)
              .then(response => response.json())
              .then(data => 
              {
                  if(data.Type === "SUCCESS")
                  {
                      
                      notification['success']({
                          message: 'Data Success',
                          description: data.Msg,
                          style:{color: '#000',border: '1px solid #ccffcc',backgroundColor: '#99ff66'},
                        });
                  
                  }
      
                  if(data.Type === "ERROR")
                  {
                      localStorage.clear();
                      notification['error']({
                          message: 'Data Error',
                          description: data.Msg,
                          style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                        });
                  }
      
              })
              .catch(error => {
                  notification['error']({
                      message: 'Data Error',
                      description: error,
                      style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                    });
              });
          }
        }
        else
        {
          if(rangedate_from === "")
          {
            notification['error']({
              message: 'Data Error',
              description: 'Please Select From Date in Daterange.',
              style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
            });
            return;
          }
          else if(rangedate_to === "")
          {
            notification['error']({
              message: 'Data Error',
              description: 'Please Select To Date in Daterange.',
              style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
            });
            return;
          }
          else
          {
            const sendOptions = {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({"cruser": session_user ,"empid" : selectemp , "proid" : url_proid, "taskdatefrom" : rangedate_from, "taskdateto" : rangedate_to, "taskdesc" : taskdesc, "taskhours" : selecthours, "tasktitle" : tasktitle})
            };

            await fetch(`${apiurl}/task/addtaskinrange`,sendOptions)
              .then(response => response.json())
              .then(data => 
              {
                  if(data.Type === "SUCCESS")
                  {
                      
                      notification['success']({
                          message: 'Data Success',
                          description: data.Msg,
                          style:{color: '#000',border: '1px solid #ccffcc',backgroundColor: '#99ff66'},
                        });
                  
                  }
      
                  if(data.Type === "ERROR")
                  {
                      localStorage.clear();
                      notification['error']({
                          message: 'Data Error',
                          description: data.Msg,
                          style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                        });
                  }
      
              })
              .catch(error => {
                  notification['error']({
                      message: 'Data Error',
                      description: error,
                      style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                    });
              });
          }
        }

        await fetch(`${apiurl}/task/alltaskproject/${url_proid}`)
        .then(res => res.json())
        .then(response => { 

            if(response.Type === "SUCCESS")
            {
              setcaldate(new Date());
              setrangedate_to(new Date());
              setrangedate_from(new Date());
              settasktitle("");
              settaskdesc("");

              setds_alltasks(response.Dataset);

            }
            else
            {
                notification['error']({
                    message: 'Data Error',
                    description: 'Data Loading Error.',
                    style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                  });
            }

             
        })
        .catch(error => {

            notification['error']({
                message: 'Data Error',
                description: error,
                style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
              });

        });
    }
 
    async function taskdelete(value)
    {
      const sendOptions = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"taskid": value})
      };

      await fetch(`${apiurl}/task/deletetask`,sendOptions)
        .then(response => response.json())
        .then(data => 
        {
            if(data.Type === "SUCCESS")
            {
                
                notification['success']({
                    message: 'Data Success',
                    description: data.Msg,
                    style:{color: '#000',border: '1px solid #ccffcc',backgroundColor: '#99ff66'},
                  });
            
            }

            if(data.Type === "ERROR")
            {
                localStorage.clear();
                notification['error']({
                    message: 'Data Error',
                    description: data.Msg,
                    style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                  });
            }

        })
        .catch(error => {
            notification['error']({
                message: 'Data Error',
                description: error,
                style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
              });
        });

        await fetch(`${apiurl}/task/alltaskproject/${url_proid}`)
        .then(res => res.json())
        .then(response => { 

            if(response.Type === "SUCCESS")
            {

              setds_alltasks(response.Dataset);

            }
            else
            {
                notification['error']({
                    message: 'Data Error',
                    description: 'Data Loading Error.',
                    style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                  });
            }

             
        })
        .catch(error => {

            notification['error']({
                message: 'Data Error',
                description: error,
                style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
              });

        });

    }

  function ActionButtonStrip(value) {
    return (
      <>
      <Tooltip title="Edit">
          <Button shape="circle" type="primary" icon={<EditOutlined />} onClick={()=>showModal(value)}/>
      </Tooltip>
      <Tooltip title="Delete">
        
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={() => taskdelete(value)}
          okText="Yes, Delete"
          cancelText="No, Cancel"
        >
          <Button shape="circle" style={{color:"white",backgroundColor:"red",borderColor:"red"}} icon={<DeleteOutlined />} />
        </Popconfirm>
       
      </Tooltip>
      </>
    );
  }

  function onChangeDate(date, dateString) {
    setcaldate(dateString);
  }

  function onChangeDateRange(date, dateString) {
    
    setrangedate_from(dateString[0]);
    setrangedate_to(dateString[1]);
  }

  function selectChangeEmployee(value) {
    setselectemp(value);
  }

  function selectChangeHours(value) {
    setselecthours(value);
  }

  function onChangeDRActive(checked) {
    setisdr_active(checked);
    
  }

  function onChangeTitle(e) {
    settasktitle(e.target.value);
  }

  function onChangeDesc(e) {
    settaskdesc(e.target.value);
  }

  const showModal = async (value) => {

    await fetch(`${apiurl}/task/taskdetails/${value}`)
    .then(res => res.json())
    .then(response => { 

        if(response.Type === "SUCCESS")
        {
            settaskid_edit(response.Dataset[0].task_id);
            setselectemp_edit(parseInt(response.Dataset[0].emp_id));
            setselecthours_edit(parseFloat(response.Dataset[0].task_hoursset).toFixed(2));
            setcaldate_edit(response.Dataset[0].task_dateset);
            settasktitle_edit(response.Dataset[0].task_title);
            settaskdesc_edit(response.Dataset[0].task_desc);
            settaskstatus_edit(response.Dataset[0].task_status);
        }
        else
        {
            notification['error']({
                message: 'Data Error',
                description: 'Data Loading Error.',
                style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
              });
        }

         
    })
    .catch(error => {

        notification['error']({
            message: 'Data Error',
            description: error,
            style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
          });

    });

    setIsModalVisible(true);
  };

  const handleOk = async () => {

    if(selectemp_edit === "")
    {
      notification['error']({
        message: 'Data Error',
        description: 'Please Select Employee.',
        style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
      });
      return;
    }

    if(selecthours_edit === "")
    {
      notification['error']({
        message: 'Data Error',
        description: 'Please Select Allocated Hours and Minutes.',
        style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
      });
      return;
    }

    if(tasktitle_edit === "")
    {
      notification['error']({
        message: 'Data Error',
        description: 'Please Enter Task Title.',
        style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
      });
      return;
    }

    const sendOptions = {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"taskid": taskid_edit ,"empid" : selectemp_edit , "taskdate" : caldate_edit, "taskdesc" : taskdesc_edit, "taskhours" : selecthours_edit, "tasktitle" : tasktitle_edit, "lcuser" : session_user, "taskstatus" : taskstatus_edit})
    };

    await fetch(`${apiurl}/task/updatetask`,sendOptions)
      .then(response => response.json())
      .then(data => 
      {
          if(data.Type === "SUCCESS")
          {
              
              notification['success']({
                  message: 'Data Success',
                  description: data.Msg,
                  style:{color: '#000',border: '1px solid #ccffcc',backgroundColor: '#99ff66'},
                });
          
          }

          if(data.Type === "ERROR")
          {
              localStorage.clear();
              notification['error']({
                  message: 'Data Error',
                  description: data.Msg,
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }

      })
      .catch(error => {
          notification['error']({
              message: 'Data Error',
              description: error,
              style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
            });
      });

      await fetch(`${apiurl}/task/alltaskproject/${url_proid}`)
        .then(res => res.json())
        .then(response => { 

            if(response.Type === "SUCCESS")
            {

              setds_alltasks(response.Dataset);

            }
            else
            {
                notification['error']({
                    message: 'Data Error',
                    description: 'Data Loading Error.',
                    style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                  });
            }

             
        })
        .catch(error => {

            notification['error']({
                message: 'Data Error',
                description: error,
                style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
              });

        });

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onChangeDate_edit(date, dateString) {
    setcaldate_edit(dateString);
  }

  function selectChangeEmployee_edit(value) {
    setselectemp_edit(value);
  }

  function selectStatus_edit(value) {
    settaskstatus_edit(value);
  }

  function selectChangeHours_edit(value) {
    setselecthours_edit(value);
  }

  function onChangeTitle_edit(e) {
    settasktitle_edit(e.target.value);
  }

  function onChangeDesc_edit(e) {
    settaskdesc_edit(e.target.value);
  }

  React.useEffect(() => {

    fetch(`${apiurl}/projects/projectdetails/${url_proid}`)
        .then(res => res.json())
        .then(response => { 

            if(response.Type === "SUCCESS")
            {
              setds_project(response.Dataset);
              setproname(response.Dataset[0].pro_name);

            }
            else
            {
                notification['error']({
                    message: 'Data Error',
                    description: 'Data Loading Error.',
                    style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                  });
            }

             
        })
        .catch(error => {

            notification['error']({
                message: 'Data Error',
                description: error,
                style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
              });

        });

    fetch(`${apiurl}/employee/allactiveemployees`)
      .then((res) => res.json())
      .then((response) => {
        if (response.Type === "SUCCESS") {

            setds_allemp(response.Dataset);

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

      fetch(`${apiurl}/task/alltaskproject/${url_proid}`)
        .then(res => res.json())
        .then(response => { 

            if(response.Type === "SUCCESS")
            {
              setds_alltasks(response.Dataset);

            }
            else
            {
                notification['error']({
                    message: 'Data Error',
                    description: 'Data Loading Error.',
                    style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                  });
            }

             
        })
        .catch(error => {

            notification['error']({
                message: 'Data Error',
                description: error,
                style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
              });

        });


  }, [apiurl,url_proid]);
 
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SIDERVIEW />
      <Layout className="site-layout">
        <HEADERVIEW />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <Link to="/allprojects">All Projects</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            New Tasks Management
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            Project Name : {proname}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Row>
              
              <Col span={6}>
                <Typography.Text style={{ color: "blue" }}>
                  Responsible :
                </Typography.Text>
                <br />
                <Select style={{ width: "90%" }} onChange={selectChangeEmployee}>
                {
                  ds_allemp.map((post) => <Option value={post.emp_id}>{post.emp_name}</Option>)
                }
                </Select>
              </Col>

              <Col span={6}>
                <Typography.Text style={{ color: "blue" }}>
                  Allocated Hours/Minutes Per Day :
                </Typography.Text>
                <br />
                <Select style={{ width: "90%" }} onChange={selectChangeHours}>
                  <Option value="0.25">0:15</Option>
                  <Option value="0.50">0:30</Option>
                  <Option value="0.75">0:45</Option>
                  <Option value="1.00">1:00</Option>
                  <Option value="1.25">1:15</Option>
                  <Option value="1.50">1:30</Option>
                  <Option value="1.75">1:45</Option>
                  <Option value="2.00">2:00</Option>
                  <Option value="2.25">2:15</Option>
                  <Option value="2.50">2:30</Option>
                  <Option value="2.75">2:45</Option>
                  <Option value="3.00">3:00</Option>
                  <Option value="3.25">3:15</Option>
                  <Option value="3.50">3:30</Option>
                  <Option value="3.75">3:45</Option>
                  <Option value="4.00">4:00</Option>
                  <Option value="4.25">4:15</Option>
                  <Option value="4.50">4:30</Option>
                  <Option value="4.75">4:45</Option>
                  <Option value="5.00">5:00</Option>
                  <Option value="5.25">5:15</Option>
                  <Option value="5.50">5:30</Option>
                  <Option value="5.75">5:45</Option>
                  <Option value="6.00">6:00</Option>
                  <Option value="6.25">6:15</Option>
                  <Option value="6.50">6:30</Option>
                  <Option value="6.75">6:45</Option>
                  <Option value="7.00">7:00</Option>
                  <Option value="7.25">7:15</Option>
                  <Option value="7.50">7:30</Option>
                  <Option value="7.75">7:45</Option>
                  <Option value="8.00">8:00</Option>
                  <Option value="8.25">8:15</Option>
                  <Option value="8.50">8:30</Option>
                  <Option value="8.75">8:45</Option>
                  <Option value="9.00">9:00</Option>
                  <Option value="9.25">9:15</Option>
                  <Option value="9.50">9:30</Option>
                  <Option value="9.75">9:45</Option>
                  <Option value="10.00">10:00</Option>
                  <Option value="10.25">10:15</Option>
                  <Option value="10.50">10:30</Option>
                  <Option value="10.75">10:45</Option>
                  <Option value="11.00">11:00</Option>
                  <Option value="11.25">11:15</Option>
                  <Option value="11.50">11:30</Option>
                  <Option value="11.75">11:45</Option>
                  <Option value="12.00">12:00</Option>
                  <Option value="12.25">12:15</Option>
                  <Option value="12.50">12:30</Option>
                  <Option value="12.75">12:45</Option>
                  <Option value="13.00">13:00</Option>
                  <Option value="13.25">13:15</Option>
                  <Option value="13.50">13:30</Option>
                  <Option value="13.75">13:45</Option>
                  <Option value="14.00">14:00</Option>
                  <Option value="14.25">14:15</Option>
                  <Option value="14.50">14:30</Option>
                  <Option value="14.75">14:45</Option>
                  <Option value="15.00">15:00</Option>
                </Select>
              </Col>
              
              <Col span={6}>
                <Typography.Text style={{ color: "blue" }}>
                  Target Date :
                </Typography.Text>
                <br />
                <DatePicker value={moment(caldate, dateFormat)} format={dateFormat} onChange={onChangeDate} size="medium" disabled={isdr_active}/>
              </Col>

              <Col span={6}>
                <Typography.Text style={{ color: "blue" }}>
                  Target Date Range : <Switch size="small" value={isdr_active} onChange={onChangeDRActive} />
                </Typography.Text>
                <br />
                <RangePicker defaultValue={[moment(new Date()),moment(new Date())]} onChange={onChangeDateRange} disabled={!isdr_active}/>
              </Col>

              <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                Task Title :
                </Typography.Text>
                <br />
                <Input width={"100%"} onChange={onChangeTitle} value={tasktitle}/>
              </Col>

              <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                Task Description :
                </Typography.Text>
                <br />
                <TextArea rows={3} cols={3} onChange={onChangeDesc} value={taskdesc}/>
                <br/>
                <Button type="primary" icon={<PlusCircleOutlined />} onClick={addtask}> ADD TASK</Button>
              </Col>
              
            </Row>
            <Row>
              <Col span={24}>
                <br/>
                <Table dataSource={ds_alltasks} columns={tablecolumns} />
              </Col>
              <br/>

              <ExcelFile filename={proname + " - Task List_" + new Date().toLocaleDateString("en-US")} element={<Button type="primary">Download Project Task List</Button>}>
              <ExcelSheet data={ds_project} name="Project Details">
                    <ExcelColumn label="Project Name" value="pro_name"/>
                    <ExcelColumn label="Current Status" value="pro_status"/>
                    <ExcelColumn label="Start" value="pro_start"/>
                    <ExcelColumn label="End" value="pro_end"/>
                </ExcelSheet>
                <ExcelSheet data={ds_alltasks} name="Project Task">
                    <ExcelColumn label="Responsible" value="emp_name"/>
                    <ExcelColumn label="Task Date" value="task_date"/>
                    <ExcelColumn label="Hours" value="task_hours"/>
                    <ExcelColumn label="Title" value="task_title"/>
                    <ExcelColumn label="Description" value="task_desc"/>
                    <ExcelColumn label="Status" value="task_status"/>
                </ExcelSheet>
            </ExcelFile>

            </Row>

            <Modal title="Edit Task Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Update" cancelText="Cancel">
              
            <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                  Task Responsible :
                </Typography.Text>
                <br />
                <Select value={selectemp_edit} style={{ width: "90%" }} onChange={selectChangeEmployee_edit}>
                {
                  ds_allemp.map((post) => <Option sele value={post.emp_id}>{post.emp_name}</Option>)
                }
                </Select>
              </Col>

              <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                Task Allocated Hours/Minutes Per Day :
                </Typography.Text>
                <br />
                <Select value={selecthours_edit} style={{ width: "90%" }} onChange={selectChangeHours_edit}>
                  <Option value="0.25">0:15</Option>
                  <Option value="0.50">0:30</Option>
                  <Option value="0.75">0:45</Option>
                  <Option value="1.00">1:00</Option>
                  <Option value="1.25">1:15</Option>
                  <Option value="1.50">1:30</Option>
                  <Option value="1.75">1:45</Option>
                  <Option value="2.00">2:00</Option>
                  <Option value="2.25">2:15</Option>
                  <Option value="2.50">2:30</Option>
                  <Option value="2.75">2:45</Option>
                  <Option value="3.00">3:00</Option>
                  <Option value="3.25">3:15</Option>
                  <Option value="3.50">3:30</Option>
                  <Option value="3.75">3:45</Option>
                  <Option value="4.00">4:00</Option>
                  <Option value="4.25">4:15</Option>
                  <Option value="4.50">4:30</Option>
                  <Option value="4.75">4:45</Option>
                  <Option value="5.00">5:00</Option>
                  <Option value="5.25">5:15</Option>
                  <Option value="5.50">5:30</Option>
                  <Option value="5.75">5:45</Option>
                  <Option value="6.00">6:00</Option>
                  <Option value="6.25">6:15</Option>
                  <Option value="6.50">6:30</Option>
                  <Option value="6.75">6:45</Option>
                  <Option value="7.00">7:00</Option>
                  <Option value="7.25">7:15</Option>
                  <Option value="7.50">7:30</Option>
                  <Option value="7.75">7:45</Option>
                  <Option value="8.00">8:00</Option>
                  <Option value="8.25">8:15</Option>
                  <Option value="8.50">8:30</Option>
                  <Option value="8.75">8:45</Option>
                  <Option value="9.00">9:00</Option>
                  <Option value="9.25">9:15</Option>
                  <Option value="9.50">9:30</Option>
                  <Option value="9.75">9:45</Option>
                  <Option value="10.00">10:00</Option>
                  <Option value="10.25">10:15</Option>
                  <Option value="10.50">10:30</Option>
                  <Option value="10.75">10:45</Option>
                  <Option value="11.00">11:00</Option>
                  <Option value="11.25">11:15</Option>
                  <Option value="11.50">11:30</Option>
                  <Option value="11.75">11:45</Option>
                  <Option value="12.00">12:00</Option>
                  <Option value="12.25">12:15</Option>
                  <Option value="12.50">12:30</Option>
                  <Option value="12.75">12:45</Option>
                  <Option value="13.00">13:00</Option>
                  <Option value="13.25">13:15</Option>
                  <Option value="13.50">13:30</Option>
                  <Option value="13.75">13:45</Option>
                  <Option value="14.00">14:00</Option>
                  <Option value="14.25">14:15</Option>
                  <Option value="14.50">14:30</Option>
                  <Option value="14.75">14:45</Option>
                  <Option value="15.00">15:00</Option>
                </Select>
              </Col>
              
              <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                Task Target Date :
                </Typography.Text>
                <br />
                <DatePicker value={moment(caldate_edit, dateFormat)} format={dateFormat} onChange={onChangeDate_edit} size="medium"/>
              </Col>

              <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                  Task Status :
                </Typography.Text>
                <br />
                <Select style={{ width: "90%" }} onChange={selectStatus_edit} value={taskstatus_edit}>
                  <Option value="Open">Open</Option>
                  <Option value="Hold">Hold</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Col>

              <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                Task Title :
                </Typography.Text>
                <br />
                <Input width={"100%"} onChange={onChangeTitle_edit} value={tasktitle_edit}/>
              </Col>

              <Col span={24}>
                <Typography.Text style={{ color: "blue" }}>
                Task Description :
                </Typography.Text>
                <br />
                <TextArea rows={3} cols={3} onChange={onChangeDesc_edit} value={taskdesc_edit}/>
              </Col>

            </Modal>

          </div>
        </Content>
        <FOOTERVIEW />
      </Layout>
    </Layout>
  );
}

export default Index;
