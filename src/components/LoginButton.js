import React, { Component } from 'react'
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'
import { isAuthenticated, logout } from '../services/auth'
import LoginDialog from './LoginDialog'
import api from '../services/api'

class LoginButton extends Component {
  state = {
    authenticated: null,
    user: null,
    token: null,
    menuAnchorEl: null,
    loginDialogOpen: false,
  }

  componentDidUpdate() {
    this.checkAuthentication()
  }

  componentDidMount() {
    this.checkAuthentication()
  }

  async checkAuthentication() {
    const authenticated = isAuthenticated()
    if (authenticated !== this.state.authenticated) {
      // TODO
      //const user = await this.props.auth.getUser()
      this.setState({ authenticated })
    }
  }

  handleOpenLoginDialog = () => {
    this.setState({
      loginDialogOpen: true,
    })
  }

  handleCloseLoginDialog = () => {
    this.checkAuthentication()
    this.setState({
      loginDialogOpen: false,
    })
  }

  logout = async e => {
    e.preventDefault()
    try {
      await api.delete('/sessions')
      logout()
      this.handleMenuClose()
    } catch (err) {
      console.error(err)
    }
  }

  handleMenuOpen = event => this.setState({ menuAnchorEl: event.currentTarget })
  handleMenuClose = () => this.setState({ menuAnchorEl: null })

  render() {
    const { authenticated, user, menuAnchorEl } = this.state

    if (authenticated == null) return null
    if (!authenticated)
      return (
        <div>
          <Button
            color="inherit"
            edge="end"
            onClick={this.handleOpenLoginDialog}
          >
            Login
          </Button>
          <LoginDialog
            open={this.state.loginDialogOpen}
            handleClose={this.handleCloseLoginDialog}
          />
        </div>
      )

    const menuPosition = {
      vertical: 'top',
      horizontal: 'right',
    }

    return (
      <div>
        <IconButton onClick={this.handleMenuOpen} color="inherit">
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          anchorOrigin={menuPosition}
          transformOrigin={menuPosition}
          open={!!menuAnchorEl}
          onClose={this.handleMenuClose}
        >
          <MenuItem onClick={this.logout}>
            <ListItemText primary="Logout" secondary={user && user.name} />
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

export default LoginButton
