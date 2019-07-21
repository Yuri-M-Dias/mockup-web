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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}))

class Teams extends Component {
  state = {
    loading: true,
    teams: [],
  }
  componentDidMount() {
    this.getTeams()
  }

  async getTeams() {
    const teams = await api.get('/teams')
    console.log([teams])
    this.setState({
      loading: false,
      teams: teams.data,
    })
  }

  classes = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }))

  render() {
    return (
      <Fragment>
        <Typography variant="display1">Posts Manager</Typography>
        {this.state.teams.length > 0 ? (
          <Grid container className={this.classes.root} spacing={5}>
            {orderBy(this.state.teams, ['total', 'name'], ['desc', 'asc']).map(
              team => (
                <Grid item xs={12} sm={4}>
                  <Card className={this.classes.card}>
                    <CardHeader title={team.name} />
                    <CardContent>
                      <Typography color="textPrimary" gutterBottom>
                        {team.total}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Link to={`/teams/${team.id}`}>
                        <Button size="small">Detalhes</Button>
                      </Link>
                      <Button size="small">Compras</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        ) : (
          !this.state.loading && (
            <Typography variant="subheading">Sem times para mostrar</Typography>
          )
        )}
        <Button
          variant="fab"
          color="secondary"
          aria-label="add"
          component={Link}
          to="/posts/new"
        >
          <AddIcon />
        </Button>
      </Fragment>
    )
  }
}

export default compose(withRouter)(Teams)
