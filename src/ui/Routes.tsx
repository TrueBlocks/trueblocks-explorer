import React from "react";
import { Route, Switch } from "react-router-dom";
import {
  DashboardLocation,
  ExplorerLocation,
  NamesLocation,
  NamesTagsLocation,
  SupportLocation,
  SystemLocation,
} from "./locations";

import {
  DashboardView,
  ExplorerView,
  NamesView,
  SupportView,
  SystemView,
} from "./views";

const routes = [
  {
    path: DashboardLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: NamesLocation,
    component: NamesView,
  },
  {
    path: NamesTagsLocation,
    component: NamesView,
  },
  {
    path: ExplorerLocation,
    component: ExplorerView,
  },
  {
    path: SupportLocation,
    component: SupportView,
  },
  {
    path: SystemLocation,
    component: SystemView,
  },
];

const CustomRoute = (props: any) => {
  const { path, component, exact } = props;

  return <Route path={path} component={component} exact={exact} />;
};

export const Routes = () => (
  <Switch>
    {routes.map((props) => (
      <CustomRoute key={props.path} {...props} />
    ))}
    <DashboardView />
  </Switch>
);
