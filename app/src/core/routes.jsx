import { Route, Switch } from "react-router";

import ROUTES from "Constants/routes";
import React from "react";
import loadable from "@loadable/component";

// Load bundles asynchronously so that the initial render happens faster
const Welcome = loadable(() =>
  import(/* webpackChunkName: "WelcomeChunk" */ "Pages/welcome/welcome")
);
const Logout = loadable(() =>
  import(/* webpackChunkName: "WelcomeChunk" */ "Pages/welcome/welcome")
);
const About = loadable(() =>
  import(/* webpackChunkName: "AboutChunk" */ "Pages/about/about")
);
const Home = loadable(() =>
  import(/* webpackChunkName: "AboutChunk" */ "Pages/home/home")
);
const Settings = loadable(() =>
  import(/* webpackChunkName: "AboutChunk" */ "Pages/settings/settings")
);

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.WELCOME} component={Welcome}></Route>
        <Route path={ROUTES.ABOUT} component={About}></Route>
        <Route path={ROUTES.HOME} component={Home}></Route>
        <Route path={ROUTES.LOGOUT} component={Logout}></Route>
        <Route path={ROUTES.SETTINGS} component={Settings}></Route>
      </Switch>
    );
  }
}

export default Routes;
