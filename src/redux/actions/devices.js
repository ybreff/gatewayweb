import { ACTIONS } from "./types"
  import DeviceDataService from "../services/devices.services"
  
  export const createDevice = (vendor, gateway_id, isonline) => async (dispatch) => {
    try {
      const res = await DeviceDataService.create({ vendor, gateway_id, isonline })
  
      dispatch({
        type: ACTIONS.CREATE_DEVICE,
        payload: res.data,
      })
  
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
  
  export const retrieveDevices = (id) => async (dispatch) => {
    try {
      const res = await DeviceDataService.getAll(id)
  
      dispatch({
        type: ACTIONS.RETRIEVE_DEVICES,
        payload: res.data,
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  export const retrieveDevice = (id) => async (dispatch) => {
    try {
      const res = await DeviceDataService.get(id)
  
      dispatch({
        type: ACTIONS.RETRIEVE_DEVICE,
        payload: res.data,
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  export const updateDevice = (id, data) => async (dispatch) => {
    try {
      const res = await DeviceDataService.update(id, data)
  
      dispatch({
        type: ACTIONS.UPDATE_DEVICE,
        payload: data,
      })
  
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
  
  export const deleteDevice = (id) => async (dispatch) => {
    try {
      const res = await DeviceDataService.delete(id)  
      dispatch({
        type: ACTIONS.DELETE_DEVICE,
        payload: { id },
      })
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  }