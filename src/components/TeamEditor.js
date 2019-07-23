import React, { Component } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  TextField,
} from '@material-ui/core'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { Form, Field } from 'react-final-form'

import api from '../services/api'
import { login } from '../services/auth'

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

class TeamEditor extends Component {
  state = {
    name: '',
    total: 0,
    error: '',
  }

  handleSubmit = async e => {
    e.preventDefault()
    const { name, total } = this.state
    if (!name || !total) {
      this.setState({ error: 'Preencha o nome e total para continuar!' })
    } else {
      try {
        const response = await api.post('/teams', { name, total })
        this.props.handleClose()
      } catch (err) {
        this.setState({
          error: 'Houve um problema com a criação do time',
        })
      }
    }
  }

  render() {
    return (
      <Dialog
        onClose={this.props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.props.open}
      >
        <DialogTitle id="team-dialog" onClose={this.props.handleClose}>
          Time
        </DialogTitle>
        <form onSubmit={this.handleSubmit} noValidate>
          <DialogContent dividers>
            {this.state.error && <p>{this.state.error}</p>}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome"
              name="name"
              autoFocus
              onChange={e => this.setState({ name: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="total"
              label="Total"
              type="number"
              id="total"
              onChange={e => this.setState({ total: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.props.handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Criar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(TeamEditor)
