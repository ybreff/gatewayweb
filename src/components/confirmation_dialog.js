import * as React from 'react';
import PropTypes from 'prop-types';
import { Button,
         DialogTitle, 
         DialogContent, 
         DialogActions, 
         Dialog } from '@mui/material';

function ConfirmationDialog(props) {
  const { onClose, onDone, value: valueProp, open, ...other } = props;

  React.useEffect(() => {}, [open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onDone();
    onClose();
  };


  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent dividers>
        Do you really want to remove this item?
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}  variant="outlined" size="medium">
          Cancel
        </Button>
        <Button onClick={handleOk}  variant="contained" size="medium">Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default ConfirmationDialog;