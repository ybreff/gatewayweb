  import { ACTIONS } from "../actions/types";
  
  const initialState = {
    gateways: [],
    gateway: null
  };
  
  function gatewayReducer(gatws = initialState, action) {
    const { type, payload } = action;
    const { gateways, gateway } = gatws
  
    switch (type) {
      case ACTIONS.CREATE_GATEWAY:
        return {...gatws, gateways: [...gateways, payload]};
  
      case ACTIONS.RETRIEVE_GATEWAYS:
        return {...gatws, gateways: payload};
  
      case ACTIONS.RETRIEVE_GATEWAY:
        return {...gatws, gateway: payload};
  
      case ACTIONS.UPDATE_GATEWAY:
        return { gateways: gateways.map((gateway) => {
                    if (gateway.id === payload.id) {
                      return {
                        ...gateway,
                        ...payload
                      };
                    } else {
                        return gateway;
                    }
                  })
                , gateway : {...gateway, ...payload}
        };
  
      case ACTIONS.DELETE_GATEWAY:
        return {...gatws, gateways: gateways.filter(({ id }) => id !== payload.id)}; 
  
       
      default:
        return gatws;
    }
  };
  
  export default gatewayReducer;