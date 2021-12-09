import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  notification,
} from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import SIDERVIEW from "../layout/siderview";
import HEADERVIEW from "../layout/headerview";
import FOOTERVIEW from "../layout/footerview";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

function Index() {
  const { Content } = Layout;

  var apiurl = localStorage.getItem("session_api");
 
  var dsEventsList = React.useState([]);

  const [EventList, setEventList] = React.useState([]);

  const [Dataload, setDataload] = React.useState(false);


  function Getcolor(val)
  {
    if(val === "Work Day")
    {
      return "#5384f5";
    }
    else if(val === "Weekend")
    {
      return "#fcba03";
    }
    else if(val === "Holiday")
    {
      return "#e03442";
    }
    else
    {
      return "#fcfdff";
    }
  }
  
React.useEffect(() => {

  if(Dataload === false)
  {
    fetch(`${apiurl}/calendar/allcalendar`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Type === "SUCCESS") {
        dsEventsList.length = 0;
        for (let i = 0; i < data.Dataset.length; i++) {
          
          dsEventsList.push({
            title: data.Dataset[i].cal_datetype,
            date: data.Dataset[i].cal_date,
            display:'background',
            backgroundColor: Getcolor(data.Dataset[i].cal_datetype),
            textColor:'#000'
          });
        }

        setEventList(dsEventsList);
        setDataload(true);

        notification["success"]({
          message: "Calendar Data Loading Success",
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

  

}, [apiurl,dsEventsList,EventList,Dataload]);
   
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
            <Breadcrumb.Item>Full Calendar View</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Row>
              
              <Col span={24}>
                <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                weekends={true}
                firstDay={1}
                events={EventList}
                weekNumbers={true}
                headerToolbar={{ start: 'title', center: '', end: 'today prevYear,prev,next,nextYear' }}
                height='75vh'
                eventTextColor='#000'
              />


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
