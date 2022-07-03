import "bulma/css/bulma.css";
import './style/App.css';
import "bootstrap/dist/css/bootstrap.css";
import './font/IRANSansWeb.woff';

import React, { Suspense } from "react";
import store, { history } from "Redux/store/store";

import { I18nextProvider } from "react-i18next";
import ReactDOM from "react-dom";
import Root from "Core/root";
import i18n from "I18n/i18n.config";

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Suspense fallback="loading">
      <Root store={store} history={history}></Root>
    </Suspense>
  </I18nextProvider>,
  document.getElementById("target")
);
