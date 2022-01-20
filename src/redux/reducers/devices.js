  import { ACTIONS } from "../actions/types";
  
  const initialState = {
    devices: [],
    device: null,
    gateway: null,
  };
  
  function deviceReducer(devc = initialState, action) {
    const { type, payload } = action;
    const { devices, device } = devc;
  
    switch (type) {
      case ACTIONS.CREATE_DEVICE:
        return {...devc, devices: [...devices, payload]};
  
      case ACTIONS.RETRIEVE_DEVICES:
        return {...devc, devices: payload};
  
      case ACTIONS.RETRIEVE_DEVICE:
        return {...devc, device: payload};
      
      case ACTIONS.RETRIEVE_GATEWAY:
          return {...devc, gateway: payload};
  
      case ACTIONS.UPDATE_DEVICE:
        return { devices: devices.map((device) => {
                    if (device.id === payload.id) {
                      return {
                        ...device,
                        ...payload
                      };
                    } else {
                        return device;
                    }
                  })
                , device : {...device, ...payload}
        };
  
      case ACTIONS.DELETE_DEVICE:
        return {...devc, devices: devices.filter(({ id }) => id !== payload.id)}; 
  
       
      default:
        return devc;
    }
  };
  
  export default deviceReducer;