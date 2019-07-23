import React, { Component } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withStyles,
  Modal,
  Button,
  TextField,
} from '@material-ui/core'
import { compose } from 'recompose'

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 500,
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: 2 * theme.spacing.unit,
  },
})

class ConfirmDeleteDialog extends Component {
  state = {}

  render() {
    return (
      <Dialog
        onClose={this.props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.props.open}
      >
        <DialogTitle id="team-dialog" onClose={this.props.handleClose}>
          Você tem certeza?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Isso vai deletar esse item. Tem certeza?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={this.props.handleClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.handleAgree}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default compose(withStyles(styles))(ConfirmDeleteDialog)
