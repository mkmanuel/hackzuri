import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CreateRoom, Room } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/room/:roomID" component={Room} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
