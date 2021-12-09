import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Layout, Breadcrumb, Typography, Select, Row, Col, notification, Table  } from 'antd';
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import SIDERVIEW from '../layout/siderview';
import HEADERVIEW from '../layout/headerview';
import FOOTERVIEW from '../layout/footerview';
import moment from 'moment';
import HeatMap from '@uiw/react-heat-map';
import Tooltip from '@uiw/react-tooltip';

function Index() 
{
    const {Content} = Layout;
    
    const { Option } = Select;
  
    var apiurl = localStorage.getItem('session_api');
    const [url_userid] = React.useState(window.location.href.split('/').reverse()[0]);
    const [thisyear] = React.useState(new Date().getFullYear());
    const [Dataforview,setDataforview] = React.useState([]);

    const tablecolumns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix()
      },
      {
        title: "Capacity Hours",
        dataIndex: "count",
        key: "count",
        sorter: (a, b) => a.count - b.count,
      }
    ];

    function handleChange_year(value) {
      
      const sendOptions = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"userid": url_userid ,"year" : value})
      };

      fetch(`${apiurl}/dataforchart/userwiseheatmap`,sendOptions)
      .then(res => res.json())
      .then(response => { 

          if(response.Type === "SUCCESS")
          {
            setDataforview(response.Dataset);

              /*notification['success']({
                  message: 'Data Success',
                  description: 'Data Loaded Successfully.',
                  style:{color: '#000',border: '1px solid #ccffcc',backgroundColor: '#99ff66'},
                });*/
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

    React.useEffect(() => {
    
      const sendOptions = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"userid": url_userid ,"year" : thisyear})
      };

      fetch(`${apiurl}/dataforchart/userwiseheatmap`,sendOptions)
      .then(res => res.json())
      .then(response => { 

          if(response.Type === "SUCCESS")
          {
            setDataforview(response.Dataset);

              /*notification['success']({
                  message: 'Data Success',
                  description: 'Data Loaded Successfully.',
                  style:{color: '#000',border: '1px solid #ccffcc',backgroundColor: '#99ff66'},
                });*/
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

  
}, [apiurl,url_userid,thisyear]);
    
    return( 
    <Layout style={{ minHeight: '100vh' }}>
    <SIDERVIEW />
    <Layout className="site-layout">
      <HEADERVIEW />
      <Content style={{ margin: '0 16px'}}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/allusers">User Wise</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Capacity - Heatmap</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Row>
          <Col span={24}>
          <Select defaultValue="2021" style={{ width: 120 }} onChange={handleChange_year}>
            <Option value="2020">2020</Option>
            <Option value="2021">2021</Option>
            <Option value="2022">2022</Option>
            <Option value="2023">2023</Option>
            <Option value="2024">2024</Option>
            <Option value="2025">2025</Option>
          </Select>
          </Col>
          </Row>
          <Row>
            <Col span={24}>
              <HeatMap 
              value={Dataforview} 
              startDate={new Date('2021/01/01')} 
              endDate={new Date('2021/12/31')} 
              width={'auto'}
              height={'400'}
              rectSize={21}
              legendCellSize={25}
              panelColors={{ 0: '#EBEDF0', 1: '#cfe2f3', 8: '#2986cc', 9: '#196127', 100: '#cc0000' }}
              weekLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
              rectProps={{
                rx: 15
              }}
              rectRender={(props, data) => {
              // if (!data.count) return <rect {...props} />;
              return (
                <Tooltip key={props.key} placement="top" content={<p>Hours: {data.count}<br/>Date: {data.date}</p>}>
                  <rect {...props}/>
                </Tooltip>
              );
            }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Table dataSource={Dataforview} columns={tablecolumns} />
            </Col>
          </Row>
        </div>
      </Content>
      <FOOTERVIEW/>
    </Layout>
  </Layout>);
}

export default Index;

