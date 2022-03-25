import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppWrapper from "./AppWrapper"
import { BrowserRouter } from "react-router-dom"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)
