import { combineReducers } from "redux";
import gateways from "./gateways";
import devices from "./devices";

export default combineReducers({
  gateways,
  devices
});