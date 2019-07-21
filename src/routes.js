import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { isAuthenticated } from './services/auth'
import PropTypes from 'prop-types'

import {
  Container,
  Box,
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
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
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
  const { container } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen)
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
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                onClick={handleDrawerToggle}
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
          <nav className={classes.drawer} aria-label="Mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <Box my={12}>
              <Switch>
                <Route exact path="/" component={() => <h1>App</h1>} />
                {definedRoutes.map(route => (
                  <Route path={route.path} component={route.component} />
                ))}
                <PrivateRoute path="/app" component={() => <h1>App</h1>} />
                <Route path="*" component={() => <h1>Page not found</h1>} />
              </Switch>
            </Box>
          </main>
        </div>
      </Container>
    </BrowserRouter>
  )
}

export default Routes
