import React, { Component } from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import LoginButton from './LoginButton'

const drawerWidth = 240

const classes = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  flex: {
    flex: 1,
  },
}))

class AppHeader extends Component {
  state = {}

  render() {
    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={this.props.onOpenDrawer}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            CubeDesign
          </Typography>
          <div className={classes.flex} />
          <LoginButton />
        </Toolbar>
      </AppBar>
    )
  }
}

export default AppHeader
