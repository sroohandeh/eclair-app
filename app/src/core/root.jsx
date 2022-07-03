import "./root.css";

import { ConnectedRouter } from "connected-react-router";
import Nav from "./nav";
import { Provider } from "react-redux";
import React from "react";
import Routes from "Core/routes";

class Root extends React.Component {
  render() {
    const { store, history } = this.props;

    return (
      <React.Fragment>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Routes></Routes>
          </ConnectedRouter>
        </Provider>
      </React.Fragment>
    );
  }
}

export default Root;
