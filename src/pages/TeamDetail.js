import React, { Component, Fragment } from 'react'
import { withRouter, Route, Redirect, Link } from 'react-router-dom'
import {
  Grid,
  withStyles,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardActions,
  CardHeader,
  CardContent,
} from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import moment from 'moment'
import { find, orderBy } from 'lodash'
import { compose } from 'recompose'

import { isAuthenticated } from '../services/auth'
import api from '../services/api'
import PropTypes from 'prop-types'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  posts: {
    marginTop: 2 * theme.spacing.unit,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  fab: {
    position: 'absolute',
    bottom: 3 * theme.spacing.unit,
    right: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      bottom: 2 * theme.spacing.unit,
      right: 2 * theme.spacing.unit,
    },
  },
})

class TeamDetail extends Component {
  state = {
    loading: true,
    team: {},
  }

  componentDidMount() {
    this.getTeam()
  }

  async getTeam() {
    const { id } = this.props.match.params
    const team = await api.get(`/teams/${id}`)
    this.setState({
      loading: false,
      team: team.data,
    })
  }

  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <Typography variant="display1">Informações do Time</Typography>
        {this.state.team ? (
          <Fragment>
            <Typography variant="display1">
              Time: {this.state.team.name}
            </Typography>
            <Typography variant="display1">
              Total: {this.state.team.total}
            </Typography>
            {this.state.team.orders > 0 ? (
              <Paper elevation={1} className={classes.orders}>
                <List>
                  {orderBy(this.state.team.orders, ['createdAt'], ['desc']).map(
                    order => (
                      <ListItem
                        className={classes.listItem}
                        key={order.id}
                        button
                        component={Link}
                        to={`/teams/${this.state.team.id}/orders/${order.id}`}
                      >
                        <ListItemText
                          primary={order.createdAt}
                          secondary={order.total}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => null} color="inherit">
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  )}
                </List>
              </Paper>
            ) : (
              !this.state.loading && (
                <Typography variant="subheading">
                  Sem compras feitas até o momento!
                </Typography>
              )
            )}
          </Fragment>
        ) : (
          !this.state.loading && (
            <Typography variant="subheading">Time inválido</Typography>
          )
        )}
      </Fragment>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(TeamDetail)
