import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Layout, Breadcrumb, Typography, Input, Row, Col,notification, Button, Switch } from 'antd';
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import SIDERVIEW from '../layout/siderview';
import HEADERVIEW from '../layout/headerview';
import FOOTERVIEW from '../layout/footerview';

function Index() 
{
    const {Content} = Layout;
    
    var apiurl = localStorage.getItem('session_api');

    const [url_empid] = React.useState(window.location.href.split('/').reverse()[0]);
    const [empad , setempad] = React.useState("");
    const [empname , setempname] = React.useState("");
    const [empwhours , setempwhours] = React.useState("");
    const [empactive , setempactive] = React.useState(false);
    
 
      function onChangeEmpad(e) {
        setempad(e.target.value);
      }

      function onChangeempname(e) {
        setempname(e.target.value);
      }

      function onChangeWhours(e) {
        setempwhours(e.target.value);
      }

      function onChangeActive(checked) {
        setempactive(checked);
      }
        
      
      function updateemployee()
      {
          if(empad === "")
          {
              notification['error']({
                  message: 'Data Error',
                  description:'Please Enter Employee AD Name.',
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }
          else if(empname === "")
          {
              notification['error']({
                  message: 'Data Error',
                  description:'Please Enter Employee Name.',
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }
          else if(empwhours=== "")
          {
              notification['error']({
                  message: 'Data Error',
                  description:'Please Enter Employee Working Hours.',
                  style:{color: '#000',border: '1px solid #ffa39e',backgroundColor: '#ff6961'},
                });
          }
          
          else
          {
            const sendOptions = {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"empid": url_empid ,"empad" : empad , "empname" : empname, "empwhours" : empwhours, "empactive" : empactive})
              };

              
              fetch(`${apiurl}/employee/updateemployee`,sendOptions)
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
    
        
        fetch(`${apiurl}/employee/employeedatails/${url_empid}`)
        .then(res => res.json())
        .then(response => { 

         

            if(response.Type === "SUCCESS")
            {
              setempad(response.Dataset[0].emp_ad);
              setempname(response.Dataset[0].emp_name);
              setempwhours(response.Dataset[0].emp_whours);
              setempactive(response.Dataset[0].emp_active);

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

    
}, [apiurl,url_empid]);
 
    return( <Layout style={{ minHeight: '100vh' }}>
    <SIDERVIEW />
    <Layout className="site-layout">
      <HEADERVIEW />
      <Content style={{ margin: '0 16px'}}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/allemployee">Employee</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Edit Employee</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Row>
            <Col span={12}>
            <Typography.Title level={5} style={{color:"#6532a8"}}>EDIT EMPLOYEE DETAILS</Typography.Title>
                <br />
                <Typography.Text style={{color:"blue"}}>Employee AD Name : (DevonP)</Typography.Text>
                <br />
                <Input required={true} size="medium" value={empad} onChange={onChangeEmpad}/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Employee Name : (Devon)</Typography.Text>
                <br />
                <Input required={true} size="medium" value={empname} onChange={onChangeempname}/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Employee Working Hours :</Typography.Text>
                <br />
                <Input required={true} size="medium" value={empwhours} onChange={onChangeWhours}/>
                <br /><br />
                <Typography.Text style={{color:"blue"}}>Employee Is Active :</Typography.Text>
                <br />
                <Switch required={true} size="medium" checked={empactive} onChange={onChangeActive}/>
                <br/>
                <br/>
                <Button  onClick={updateemployee} type="primary" htmlType="submit" size="large">
                    Update Employee Details
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

