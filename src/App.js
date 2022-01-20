import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GatewayList from "./pages/gateways/gateway_list";
import DevicesList from "./pages/devices/devices_list";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/gateways"} className="nav-link">
              Gateways
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/gateways"]} component={GatewayList} />
          <Route exact path={["/gateway/:id"]} component={DevicesList} />
        </Switch>
      </div>
      <ToastContainer closeButton={true} position="top-right" />
    </Router>
  );
}

export default App;


