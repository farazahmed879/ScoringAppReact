import * as React from 'react';

import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import utils from '../../utils/utils';
import Home from '../../scenes/Home';

const Router = () => {
  const UserLayout = utils.getRoute('/user').component;
  const AppLayout = utils.getRoute('/').component;
  //const LandingAppLayout = utils.getRoute('/main').component;

  return (
    <Switch>
      {/* <Route path="/main" render={(props: any) => <LandingAppLayout {...props} />} /> */}
      <Route path="/home" render={(props: any) => <Home />} />
      <Route path="/user" render={(props: any) => <UserLayout {...props} />} />
      <ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} />
    </Switch>
  );
};

export default Router;
