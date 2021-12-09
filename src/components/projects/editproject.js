import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Layout, Breadcrumb, Typography, Input, Row, Col, DatePicker, notification, Button, Select } from 'antd';
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import SIDERVIEW from '../layout/siderview';
import HEADERVIEW from '../layout/headerview';
import FOOTERVIEW from '../layout/footerview';
import moment from "moment";

function Index() 
{
    const {Content} = Layout;
    const { Option } = Select;
    
    var apiurl = localStorage.getItem('session_api');

    const [url_proid] = React.useState(window.location.href.split('/').reverse()[0]);
    const dateFormat = "YYYY-MMM-DD";
    const [proname , setproname] = React.useState("");
    const [datestart , setdatestart] = React.useState(moment(new Date()).format(dateFormat));
    const [dateend , setdateend] = React.useState(moment(new Date()).format(dateFormat));
    const [prostatus , setprostatus] = React.useState("");
 
    function onChangeText(e) {
        setproname(e.target.value);
      }

    function onChangeStart(date, dateString) {
        if(dateString === "")
        {
          setdatestart(moment(new Date()).format(dateFormat));
        }
        else
        {
          setdatestart(dateString);
        }   
        
      }

    function onChangeEnd(date, dateString) {
        if(dateString === "")
        {
          setdateend(moment(new Date()).format(dateFormat));
        }
        else
        {
          setdateend(dateString);
        }  
      }

      function onChangeStatus(value) {
        setprostatus(value);
      }

      function updateProject()
      {
          if(proname === "")
          {
              notification['error']({
                  message: 'Data Error',
                  description:'Please Enter Project Name.',
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }
          else if(datestart === "")
          {
              notification['error']({
                  message: 'Data Error',
                  description:'Please Select Project Start Date.',
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }
          else if(dateend === "")
          {
              notification['error']({
                  message: 'Data Error',
                  description:'Please Select Project End Date.',
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }
          else if(prostatus === "")
          {
              notification['error']({
                  message: 'Data Error',
                  description:'Please Select Project Status.',
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }
          else
          {
            const sendOptions = {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"proid": url_proid ,"proname" : proname , "prostart" : datestart, "proend" : dateend, "prostatus" : prostatus})
              };

              fetch(`${apiurl}/projects/updateprojects`,sendOptions)
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

      React.useEffect(() => {
    
        fetch(`${apiurl}/projects/projectdetails/${url_proid}`)
        .then(res => res.json())
        .then(response => { 

            if(response.Type === "SUCCESS")
            {
              setproname(response.Dataset[0].pro_name);
              setdatestart(String(moment(response.Dataset[0].pro_start).format(dateFormat)));
              setdateend(String(moment(response.Dataset[0].pro_end).format(dateFormat)));
              setprostatus(response.Dataset[0].pro_status);

                notification['success']({
                    message: 'Data Success',
                    description: 'Data Loaded Successfully.',
                    style:{color: '#000',border: '1px solid #ccffcc',backgroundColor: '#99ff66'},
                  });
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
 
    return( <Layout style={{ minHeight: '100vh' }}>
    <SIDERVIEW />
    <Layout className="site-layout">
      <HEADERVIEW />
      <Content style={{ margin: '0 16px'}}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/allprojects">Projects</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Edit Projects</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Row>
            <Col span={12}>
                <Typography.Title level={5} style={{color:"#6532a8"}}>EDIT PROJECT DETAILS</Typography.Title>
                <br />
                <Typography.Text style={{color:"blue"}}>Project Name :</Typography.Text>
                <br />
                <Input required={true} size="medium" value={proname} onChange={onChangeText}/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Project Start Date :</Typography.Text>
                <br />
                <DatePicker onChange={onChangeStart} value={moment(datestart, dateFormat)} format={dateFormat}/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Project End Date :</Typography.Text>
                <br />
                <DatePicker onChange={onChangeEnd} value={moment(dateend, dateFormat)} format={dateFormat}/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Project Status :</Typography.Text>
                <br />
                <Select style={{ width: 150 }} onChange={onChangeStatus} value={prostatus}>
                  <Option value="Ongoing">Ongoing</Option>
                  <Option value="Onhold">Onhold</Option>
                  <Option value="Finished">Finished</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
                <br/>
                <br/>
                <Button  onClick={updateProject} type="primary" htmlType="submit" size="large">
                    Update Project Details
                </Button>
            </Col>
          </Row>
        </div>
      </Content>
      <FOOTERVIEW/>
    </Layout>
  </Layout>);
}

export default Index;

