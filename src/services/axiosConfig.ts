import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_SERVICE_URL as string
axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.headers.common["Allow-Origin"] = "*"
