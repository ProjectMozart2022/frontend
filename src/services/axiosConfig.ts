import axios from "axios"

axios.defaults.baseURL = "https://mozart-backend.azurewebsites.net/api/"
axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.headers.common["Allow-Origin"] = "*"
