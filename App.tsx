import "react-native-gesture-handler";
import React from "react";
import AppContainer from "./src/routes/Routes.index";
import moment from "moment";
moment.locale("en");

import { Provider } from "react-redux";
import { store } from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}
