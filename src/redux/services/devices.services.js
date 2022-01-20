import axios from "../../axios/http-common"

class DeviceDataService {
  getAll(id) {
    return axios.get(`/devices/gateway/${id}`)
  }

  get(id) {
    return axios.get(`/devices/${id}`)
  }

  create(data) {
    return axios.post("/devices", data)
  }

  update(id, data) {
    return axios.put(`/devices/${id}`, data)
  }

  delete(id) {
    return axios.delete(`/devices/${id}`)
  }
}

export default new DeviceDataService()