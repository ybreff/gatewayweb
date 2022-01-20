import * as React from 'react';
import PropTypes from 'prop-types';
import { Button,
         DialogTitle, 
         DialogContent, 
         DialogActions, 
         Dialog } from '@mui/material';

function ModalForm(props) {
  const { onClose, onSave, modaltitle, open, childrens, ...other } = props;

  React.useEffect(() => {}, [open]);

  const handleCancel = () => {
    onClose();
  };

  const handleSave = () => {
    onSave();
  };


  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>{modaltitle}</DialogTitle>
      <DialogContent dividers>
        {childrens}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}  variant="outlined" size="medium">
          Cancel
        </Button>
        <Button onClick={handleSave}  variant="contained" size="medium">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

ModalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ModalForm;