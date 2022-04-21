import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import axios from "axios"

axios.defaults.baseURL = "https://mozart-backend.azurewebsites.net/api/"
axios.defaults.headers.post['Content-Type'] = "application/json"
axios.defaults.headers.common['Allow-Origin'] = "*"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
