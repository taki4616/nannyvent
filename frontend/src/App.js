import logo from "./logo.svg";
import React from "react";
import TestConnection from "./TestConnection";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Home />
      <TestConnection />
    </div>
  );
}

export default App;
