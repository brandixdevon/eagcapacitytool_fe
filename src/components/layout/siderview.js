import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import { Layout, Menu, Avatar } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import {
  DesktopOutlined,
  ProjectOutlined,
  PieChartOutlined,
  CheckOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

function Siderview() {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const [collapsed, setcollapsed] = React.useState(false);

  const onCollapse = () => {
    if (collapsed === true) {
      setcollapsed(false);
    } else {
      setcollapsed(true);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{ backgroundColor: "#fff" }}
    >
      <div className="logo" style={{ backgroundColor: "#6532a8" }}>
        <center>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#ba9de0", marginTop: "7px" }}
          />
        </center>
      </div>
      <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Capacity View
        </Menu.Item>
        <SubMenu key="3" icon={<CalendarOutlined />} title="Calendar">
          <Menu.Item key="31">
            <Link to="/addcalendar">Add/Change Dates</Link>
          </Menu.Item>
          <Menu.Item key="32">
            <Link to="/calendarfullview">Full View</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="4" icon={<TeamOutlined />} title="Employees">
          <Menu.Item key="41">
            <Link to="/newemployee">Add New</Link>
          </Menu.Item>
          <Menu.Item key="42">
            {" "}
            <Link to="/allemployee">View List</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="5" icon={<ProjectOutlined />} title="Projects">
          <Menu.Item key="51">
            <Link to="/newproject">Add New</Link>
          </Menu.Item>
          <Menu.Item key="52">
            <Link to="/allprojects">View List</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="6" icon={<CheckOutlined />} title="Tasks">
          <Menu.Item key="61">
            <Link to="/dailytasks">Daily Task</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="7" icon={<UserOutlined />}>
          <Link to="/login">Sign Out</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Siderview;
