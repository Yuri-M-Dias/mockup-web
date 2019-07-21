import React, { Component } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core'

import api from '../services/api'
import { login } from '../services/auth'

class LoginDialog extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  }

  handleSignIn = async e => {
    e.preventDefault()
    const { email, password } = this.state
    if (!email || !password) {
      this.setState({ error: 'Preencha e-mail e senha para continuar!' })
    } else {
      try {
        const response = await api.post('/sessions', { email, password })
        login(response.data.token)
        //this.props.history.push('/app')
        this.props.handleClose()
      } catch (err) {
        this.setState({
          error:
            'Houve um problema com o login, verifique suas credenciais. T.T',
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
        <DialogTitle
          id="customized-dialog-title"
          onClose={this.props.handleClose}
        >
          Login
        </DialogTitle>
        <form onSubmit={this.handleSignIn} noValidate>
          <DialogContent dividers>
            {this.state.error && <p>{this.state.error}</p>}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={e => this.setState({ email: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.props.handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Sign In
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default LoginDialog
