import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { isAuthenticated } from './services/auth'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import {
  Container,
  Box,
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'

import LoginButton from './components/LoginButton'
import SignUp from './pages/SignUp/signup'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
)

const drawerWidth = 240
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}))

class ListItemLink extends React.Component {
  renderLink = React.forwardRef((itemProps, ref) => (
    // with react-router-dom@^5.0.0 use `ref` instead of `innerRef`
    <RouterLink to={this.props.to} {...itemProps} innerRef={ref} />
  ))

  render() {
    const { icon, primary } = this.props
    return (
      <li>
        <ListItem button component={this.renderLink}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    )
  }
}

ListItemLink.propTypes = {
  icon: PropTypes.node.isRequired,
  primary: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
}

// polyfill required for react-router-dom < 5.0.0
const Link = React.forwardRef((props, ref) => (
  <RouterLink {...props} innerRef={ref} />
))

function ListItemLinkShorthand(props) {
  const { primary, to } = props
  return (
    <li>
      <ListItem button component={Link} to={to}>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

ListItemLinkShorthand.propTypes = {
  primary: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
}

const definedRoutes = [
  {
    text: 'TeamDetail',
    path: '/teams/:id',
    component: TeamDetail,
  },
  {
    text: 'Teams',
    path: '/teams',
    component: Teams,
  },
  {
    text: 'Products',
    path: '/products',
    component: () => <h1>Products</h1>,
  },
  {
    text: 'Orders',
    path: '/orders',
    component: () => <h1>Orders</h1>,
  },
  {
    text: 'Sign-up',
    path: '/signup',
    component: SignUp,
  },
]

const Routes = props => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  function handleDrawerOpen() {
    setOpen(true)
  }

  function handleDrawerClose() {
    setOpen(false)
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {definedRoutes.map(route => (
          <ListItemLink
            to={route.path}
            primary={route.text}
            icon={route.icon}
          />
        ))}
      </List>
      <Divider />
    </div>
  )

  return (
    <BrowserRouter>
      <Container fixed>
        <div className={classes.root}>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton, open && classes.hide)}
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
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            {drawer}
          </Drawer>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            <Container maxWidth="md">
              <Switch>
                <Route exact path="/" component={() => <h1>App</h1>} />
                {definedRoutes.map(route => (
                  <Route path={route.path} component={route.component} />
                ))}
                <PrivateRoute path="/app" component={() => <h1>App</h1>} />
                <Route path="*" component={() => <h1>Page not found</h1>} />
              </Switch>
            </Container>
          </main>
        </div>
      </Container>
    </BrowserRouter>
  )
}

export default Routes
