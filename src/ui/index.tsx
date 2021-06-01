import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalStateProvider } from "./state";

import { App } from "./App";

render(
  <GlobalStateProvider>
    <Router>
      <App />
    </Router>
  </GlobalStateProvider>,
  document.getElementById("root")
);
