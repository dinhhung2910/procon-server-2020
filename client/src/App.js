import React, {Fragment, useEffect} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import {Counter} from './features/counter/Counter';
import './styles/vendor.scss';
import Login from './components/containers/login';
import {loadUser} from './features/login/loginSlice';
import {useDispatch} from 'react-redux';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/counter" component={Counter}></Route>
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
