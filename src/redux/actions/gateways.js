import { ACTIONS } from "./types"
  import GatewayDataService from "../services/gateways.services"
  
  export const createGateway = (name, address) => async (dispatch) => {
    try {
      const res = await GatewayDataService.create({ name, address })
  
      dispatch({
        type: ACTIONS.CREATE_GATEWAY,
        payload: res.data,
      })
  
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
  
  export const retrieveGateways = () => async (dispatch) => {
    try {
      const res = await GatewayDataService.getAll()
  
      dispatch({
        type: ACTIONS.RETRIEVE_GATEWAYS,
        payload: res.data,
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  export const retrieveGateway = (id) => async (dispatch) => {
    try {
      const res = await GatewayDataService.get(id)
  
      dispatch({
        type: ACTIONS.RETRIEVE_GATEWAY,
        payload: res.data,
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  export const updateGateway = (id, data) => async (dispatch) => {
    try {
      const res = await GatewayDataService.update(id, data)
  
      dispatch({
        type: ACTIONS.UPDATE_GATEWAY,
        payload: data,
      })
  
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
  
  export const deleteGateway = (id) => async (dispatch) => {
    try {
      const res = await GatewayDataService.delete(id)  
      dispatch({
        type: ACTIONS.DELETE_GATEWAY,
        payload: { id },
      })
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  }