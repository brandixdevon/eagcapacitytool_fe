import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Layout, Breadcrumb, Typography, Input, Row, Col, DatePicker, notification, Button  } from 'antd';
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import SIDERVIEW from '../layout/siderview';
import HEADERVIEW from '../layout/headerview';
import FOOTERVIEW from '../layout/footerview';

function Index() 
{
    const {Content} = Layout;
  
    var apiurl = localStorage.getItem('session_api');

    const [proname , setproname] = React.useState("");
    const [datestart , setdatestart] = React.useState("");
    const [dateend , setdateend] = React.useState("");
 
    function onChangeText(e) {
        setproname(e.target.value);
      }

    function onChangeStart(date, dateString) {
        setdatestart(dateString);
      }

    function onChangeEnd(date, dateString) {
        setdateend(dateString);
      }

      function addProject()
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
          else
          {
            const sendOptions = {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"proname" : proname , "prostart" : datestart, "proend" : dateend, "prostatus" : "Ongoing"})
              };

              fetch(`${apiurl}/projects/addprojects`,sendOptions)
                .then(response => response.json())
                .then(data => 
                {
                    if(data.Type === "SUCCESS")
                    {
                        setproname("");
                        setdatestart("");
                        setdateend("");

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
 
    return( <Layout style={{ minHeight: '100vh' }}>
    <SIDERVIEW />
    <Layout className="site-layout">
      <HEADERVIEW />
      <Content style={{ margin: '0 16px'}}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/allprojects">Projects</Link></Breadcrumb.Item>
          <Breadcrumb.Item>New Projects</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Row>
            <Col span={12}>
                <Typography.Title level={5} style={{color:"#6532a8"}}>ADD NEW PROJECT</Typography.Title>
                <br />
                <Typography.Text style={{color:"blue"}}>Project Name :</Typography.Text>
                <br />
                <Input required={true} size="medium" value={proname} onChange={onChangeText}/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Project Start Date :</Typography.Text>
                <br />
                <DatePicker onChange={onChangeStart} size="large"/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Project End Date :</Typography.Text>
                <br />
                <DatePicker onChange={onChangeEnd} size="large" />
                <br/>
                <br/>
                <Button  onClick={addProject} type="primary" htmlType="submit" size="large">
                    Add New Project
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

