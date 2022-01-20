import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  retrieveGateways,
  deleteGateway,
  retrieveGateway,
  createGateway,
  updateGateway,
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
} from '@mui/material';
import { Delete, Visibility, Add, Devices, Edit } from '@mui/icons-material';
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

class GatewaysList extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.displayGatewayDetails = this.displayGatewayDetails.bind(this);
    this.removeGateway = this.removeGateway.bind(this);
    this.onpenDialog = this.onpenDialog.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitCreateUpdateGateway = this.submitCreateUpdateGateway.bind(this);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);

    this.state = {
      currentIndex: -1,
      searchName: '',
      dialogOpen: false,
      modalOpen: false,
      fields: {},
      errors: {},
    };
  }

  componentDidMount() {
    this.props.retrieveGateways();
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName,
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
    const { gateway } = this.props.gateways;
    let fields = {};
    if(id !== -1 ){
      fields['name'] = gateway.name;
      fields['address'] = gateway.address;
    }
    else{
      fields['name'] = ''
      fields['address'] = ''
    }
    this.setState({
      currentIndex: id,
      fields,
      errors: {}
    })
    this.setOpen('modal-form', true);
  }

  handleCloseDialog() {
    this.setOpen("dialog-remove", false);
  }

  handleCloseModal() {
    this.setOpen("modal-form", false);
  }

  refreshData() {
    this.props.retrieveGateways();
    let fields = {};
    fields['name'] = '';
    fields['address'] = '';
    this.setState({
      currentIndex: -1,
      fields,
      modalOpen: false,
      dialogOpen: false,
    });
  }

  displayGatewayDetails(gatwId) {
    this.props.retrieveGateway(gatwId);
  }

  removeGateway() {
    const { currentIndex } = this.state;
    this.props
      .deleteGateway(currentIndex)
      .then((response) => {
        this.refreshData();
        toast.success('Gateway removed succefull');
      })
      .catch((e) => {
        console.log(e);
        toast.error('Error removing gateway, please try again');
      })
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

  submitCreateUpdateGateway() {
    if (this.validateForm()) {
      let {fields, currentIndex} = this.state;
      const name = fields['name'];
      const address = fields['address'];
      const request = currentIndex === -1 ? this.props.createGateway(name, address) : this.props.updateGateway(currentIndex, {name, address});
      const [operationSuccess, operationError] = currentIndex === -1 ? ["inserted", "inserting"] : ["updated", "updating"];
      request.then((response) => {
            this.refreshData();
            toast.success('Gateway '+operationSuccess+' succefull');
          })
          .catch((e) => {
            toast.error('Error '+operationError+' gateway, please try again');
          });
      }      
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields['name']) {
      formIsValid = false;
      errors['name'] = 'Please enter the gateway name.';
    }

    if (!fields['address']) {
      formIsValid = false;
      errors['address'] = 'Please enter the gateway address.';
    }

    if (typeof fields['address'] !== 'undefined') {
      //regular expression for address validation
      var pattern = new RegExp(
        /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
      );
      if (!pattern.test(fields['address'])) {
        formIsValid = false;
        errors['address'] = 'Please enter a valid gateway address.';
      }
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  
  goToView = async (event, gtwId, sRoute) => {
    event.stopPropagation();
    await this.props.retrieveGateway(gtwId);
    this.props.history.push(sRoute);
  };

  render() {
    const {
      searchName,
      currentIndex,
      dialogOpen,
      fields,
      errors,
      modalOpen,
    } = this.state;
    const { gateways, gateway } = this.props.gateways;
    const modaltitle = currentIndex === -1 ? "New Gateway" : "Edit Gateway";

    const gtwList = gateways.filter((gt) => {
      return  gt.name.toLowerCase().includes(searchName.toLowerCase());
    });
    

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Search by name" value={searchName} onChange={this.onChangeSearchName} />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={this.findByName}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-10">
          <h4>Gateways List</h4>
        </div>
        <div className="col-md-6">
          <Button variant="contained" className="my-2" startIcon={<Add />} onClick={() => this.openModal(-1)}>
            New
          </Button>
          {gtwList.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="customized table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Address</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gtwList.map((row, index) => (
                    <StyledTableRow key={row.name} selected={index === currentIndex} >
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell>{row.address}</StyledTableCell>
                      <StyledTableCell style={{ width: 155 }}>
                        <IconButton aria-label="view" title="View"  onClick={() => this.displayGatewayDetails(row.id)} >
                          <Visibility />
                        </IconButton>
                        <IconButton aria-label="devices" title="Devices" onClick={(event) => this.goToView(event, row.id, "/gateway/" + row.id)}>
                          <Devices />
                        </IconButton>
                        <IconButton aria-label="delete" title="Delete" onClick={() => this.onpenDialog(row.id)} >
                          <Delete />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">There is not gateways to show</Alert>
          )}
        </div>
        <div className="col-md-6">
          {gateway ? (
            <div>
              <h4>Details</h4>
              <Card variant="outlined">
                <CardContent>
                  <List>
                    <ListItem>
                      <strong>Name:</strong>&nbsp;{gateway.name}
                    </ListItem>
                    <ListItem>
                      <strong>Address:</strong>&nbsp;{gateway.address}
                    </ListItem>
                    <ListItem>
                      <strong>Created:</strong>&nbsp;
                      {helpers.formatDate(gateway.createdAt)}
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" startIcon={<Edit />}  onClick={() => this.openModal(gateway.id)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on <Visibility /> icon to see the Gateway info...</p>
            </div>
          )}
        </div>
        <ConfirmationDialog id="dialog-remove" keepMounted open={dialogOpen} onClose={this.handleCloseDialog}  onDone={this.removeGateway} />
        <ModalForm id="modal-form" keepMounted open={modalOpen} modaltitle={modaltitle} onClose={this.handleCloseModal} onSave={this.submitCreateUpdateGateway}
          childrens={
            <form name="gatewayForm">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" name="name" id="name" value={fields.name} onChange={this.handleChange} autoComplete="off" />
                <div className="text-danger">{errors.name}</div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input type="text" className="form-control" name="address" id="address" value={fields.address} onChange={this.handleChange} autoComplete="off"/>
                <div className="text-danger">{errors.address}</div>
              </div>
            </form>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    gateways: state.gateways,
    gateway: state.gateway,
  };
}

const mapDispatchToProps = {
  retrieveGateways,
  deleteGateway,
  retrieveGateway,
  createGateway,
  updateGateway
};

export default connect(mapStateToProps, mapDispatchToProps)(GatewaysList);
