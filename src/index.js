import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router,Switch,Route,Redirect } from "react-router-dom";

import Log from './components/Auth/login';
import Dashboard from './components/layout/dash';

//Projects Views
import Newprojects from './components/projects/newproject';
import Allprojects from './components/projects/projectslist';
import Editproject from './components/projects/editproject';
import ProjectView1 from './components/projects/projectview1';
import ProjectView2 from './components/projects/projectview2';

//Employee Views
import Newemployee from './components/employee/newemployee';
import Allemployee from './components/employee/employeelist';
import Editemployee from './components/employee/editemployee';

//Calendar Views
import AddCalendar from './components/calendar/calendaradd';
import Calendarfullview from './components/calendar/calendarfullview';

//Task Views
import AddTasks from './components/tasks/addtasks';
import DailyTasks from './components/tasks/dailytasks';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
      <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login">
            <Log />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/newproject">
            <Newprojects />
          </Route>
          <Route path="/allprojects">
            <Allprojects />
          </Route>
          <Route path="/editproject/:id">
            <Editproject />
          </Route>
          <Route path="/projectview1">
            <ProjectView1 />
          </Route>
          <Route path="/projectview2">
            <ProjectView2 />
          </Route>
          <Route path="/newemployee">
            <Newemployee />
          </Route>
          <Route path="/allemployee">
            <Allemployee />
          </Route>
          <Route path="/editemployee/:id">
            <Editemployee />
          </Route>
          <Route path="/addcalendar">
            <AddCalendar />
          </Route>
          <Route path="/calendarfullview">
            <Calendarfullview />
          </Route>
          <Route path="/addtask/:id">
            <AddTasks />
          </Route>
          <Route path="/dailytasks">
            <DailyTasks />
          </Route>
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
