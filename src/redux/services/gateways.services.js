import axios from "../../axios/http-common"

class GatewayDataService {
  getAll() {
    return axios.get("/gateways")
  }

  get(id) {
    return axios.get(`/gateways/${id}`)
  }

  create(data) {
    return axios.post("/gateways", data)
  }

  update(id, data) {
    return axios.put(`/gateways/${id}`, data)
  }

  delete(id) {
    return axios.delete(`/gateways/${id}`)
  }
}

export default new GatewayDataService()