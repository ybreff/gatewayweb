import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  retrieveDevices,
  deleteDevice,
  retrieveDevice,
  createDevice,
  updateDevice,
} from '../../redux/actions/devices';
import {
  retrieveGateway
} from '../../redux/actions/gateways';
import { toast } from 'react-toastify';
import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardActions,
  CardContent,
  Button,
  List,
  ListItem,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Delete, Visibility, Add, Edit, WifiOff, Wifi, ArrowBack } from '@mui/icons-material';
import { helpers } from '../../helpers';
import ConfirmationDialog from '../../components/confirmation_dialog';
import ModalForm from '../../components/modal_form';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

class DevicesList extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.displayDeviceDetails = this.displayDeviceDetails.bind(this);
    this.removeDevice = this.removeDevice.bind(this);
    this.onpenDialog = this.onpenDialog.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.submitCreateUpdateDevice = this.submitCreateUpdateDevice.bind(this);
    this.onChangeSearchVendor = this.onChangeSearchVendor.bind(this);

    this.state = {
      currentIndex: -1,
      searchVendor: '',
      dialogOpen: false,
      modalOpen: false,
      fields: {},
      errors: {},
      isonline: true
    };
  }

  componentDidMount() {
    const gatewy_id = this.props.match.params.id;
    this.props.retrieveDevices(gatewy_id);
    this.props.retrieveGateway(gatewy_id);
  }

  onChangeSearchVendor(e) {
    const searchVendor = e.target.value;

    this.setState({
      searchVendor: searchVendor,
    });
  }
  setOpen(target, value) {
    if (target === 'dialog-remove')
      this.setState({
        dialogOpen: value,
      });
    if (target === 'modal-form')
      this.setState({
        modalOpen: value,
      });
  }
  onpenDialog(id) {
    this.setState({
      currentIndex: id,
    });
    this.setOpen('dialog-remove', true);
  }

  openModal(id) {
    const { device, devices } = this.props.devices;
    if(devices.length < 10){
      let fields = {};
      if(id !== -1 ){
        fields['vendor'] = device.vendor;
      }
      else{
        fields['vendor'] = '';
      }
      this.setState({
        currentIndex: id,
        fields,
        errors: {},
        isonline: device ? device.isonline : false
      });
      this.setOpen('modal-form', true);
    } else {
      toast.error("Gateway can't contain more of 10 devices");
    }
  }

  handleCloseDialog() {
    this.setOpen("dialog-remove", false);
  }

  handleCloseModal() {
    this.setOpen("modal-form", false);
  }

  refreshData() {
    const gatewy_id = this.props.match.params.id;
    this.props.retrieveDevices(gatewy_id);
    this.props.retrieveGateway(gatewy_id);
    let fields = {};
    fields['vendor'] = '';
    this.setState({
      currentIndex: -1,
      fields,
      modalOpen: false,
      dialogOpen: false,
      isonline: true
    });
  }

  displayDeviceDetails(gatwId) {
    this.props.retrieveDevice(gatwId);
  }

  removeDevice() {
    const { currentIndex } = this.state;
    this.props
      .deleteDevice(currentIndex)
      .then((response) => {
        this.refreshData();
        toast.success('Device removed succefull')
      })
      .catch((e) => {
        toast.error('Error removing device, please try again')
      });
  }

  handleChange(e) {
    let fields = this.state.fields;
    let errors = this.state.errors;
    fields[e.target.name] = e.target.value;
    errors[e.target.name] = '';
    this.setState({
      fields,
      errors,
    });
  }

  handleSwitch(e) {
    this.setState({
      isonline: e.target.checked
    });
  }

  submitCreateUpdateDevice() {
    if (this.validateForm()) {
      const gatewy_id = this.props.match.params.id;
      let {fields, currentIndex, isonline} = this.state;
      const vendor = fields['vendor'];
      const request = currentIndex === -1 ? this.props.createDevice(vendor, gatewy_id, isonline ) : this.props.updateDevice(currentIndex, {vendor, gatewy_id, isonline});
      const [operationSuccess, operationError] = currentIndex === -1 ? ["inserted", "inserting"] : ["updated", "updating"];
      request.then((response) => {
          this.refreshData();
          toast.success('Device '+operationSuccess+' succefull');
        })
        .catch((e) => {
          toast.error('Error '+operationError+' device, please try again');
        });
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields['vendor']) {
      formIsValid = false;
      errors['vendor'] = 'Please enter the device vendor.';
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    const {
      searchVendor,
      currentIndex,
      dialogOpen,
      fields,
      errors,
      modalOpen,
      isonline
    } = this.state
    const { devices, device, gateway } = this.props.devices;
    const modaltitle = currentIndex === -1 ? "New Device" : "Edit Device";

    const gtwList = devices.filter((gt) => {
      return  gt.vendor.toLowerCase().includes(searchVendor.toLowerCase());
    });
    
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Search by vendor" value={searchVendor} onChange={this.onChangeSearchVendor}/>
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={this.findByVendor}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2"> 
           <Button  variant="outlined"  startIcon={<ArrowBack />}  onClick={() => this.props.history.push("/gateways")}  >
              Get back
           </Button>
        </div>
        <div className="col-md-10"> 
          <h4>Devices List of Gateway {gateway ? gateway.name : "-"}</h4>
        </div>
        <div className="col-md-6">
          <div>
            <Button variant="contained" className="my-2" startIcon={<Add />}  onClick={() => this.openModal(-1)}  >
              New
            </Button>
            <h6 style={{ width: 115 }} className="float-right mt-3">Devices {devices.length} of 10</h6>
          </div>
          {gtwList.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="customized table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Vendor</StyledTableCell>
                    <StyledTableCell>Created</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gtwList.map((row, index) => (
                    <StyledTableRow key={row.vendor} selected={index === currentIndex} >
                      <StyledTableCell component="th" scope="row">
                        {row.vendor}
                      </StyledTableCell>
                      <StyledTableCell>{helpers.formatDate(row.createdAt)}</StyledTableCell>
                      <StyledTableCell> {row.isonline ? <Wifi/> : <WifiOff/>}</StyledTableCell>
                      <StyledTableCell style={{ width: 155 }}>
                        <IconButton aria-label="view" title="View" onClick={() => this.displayDeviceDetails(row.id)}>
                          <Visibility />
                        </IconButton>
                        <IconButton aria-label="delete" title="Delete" onClick={() => this.onpenDialog(row.id)}>
                          <Delete />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">There is not devices to show</Alert>
          )}
        </div>
        <div className="col-md-6">
          {device ? (
            <div>
              <h4>Details</h4>
              <Card variant="outlined">
                <CardContent>
                  <List>
                    <ListItem>
                      <strong>Vendor:</strong>&nbsp;{device.vendor}
                    </ListItem>
                    <ListItem>
                      <strong>Created:</strong>&nbsp;
                      {helpers.formatDate(device.createdAt)}
                    </ListItem>                    
                    <ListItem>
                      <strong>Status:</strong>&nbsp;
                      {device.isonline ? "online" : "offline"}
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" startIcon={<Edit />}  onClick={() => this.openModal(device.id)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on <Visibility /> icon to see the Device info...</p>
            </div>
          )}
        </div>
        <ConfirmationDialog id="dialog-remove" keepMounted  open={dialogOpen} onClose={this.handleCloseDialog} onDone={this.removeDevice}/>
        <ModalForm id="modal-form" keepMounted open={modalOpen} modaltitle={modaltitle} onClose={this.handleCloseModal} onSave={this.submitCreateUpdateDevice}
          childrens={
            <form vendor="deviceForm">
              <div className="form-group">
                <label htmlFor="vendor">Vendor</label>
                <input type="text" className="form-control" name="vendor" id="vendor" value={fields.vendor} onChange={this.handleChange} autoComplete="off"/>
                <div className="text-danger">{errors.vendor}</div>
              </div>
              <FormControlLabel
                control={
                  <Switch checked={isonline} onChange={this.handleSwitch} name="online" />
                }
                label="Online"
              />
            </form>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    devices: state.devices,
    device: state.device,
  };
}

const mapDispatchToProps = {
  retrieveDevices,
  deleteDevice,
  retrieveDevice,
  createDevice,
  updateDevice,
  retrieveGateway
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesList);
