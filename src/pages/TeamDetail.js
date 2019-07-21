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
      <Card className={this.classes.card}>
        <CardHeader title={this.state.team.name} />
        <CardContent>
          <Typography color="textPrimary" gutterBottom>
            {this.state.team.total}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Detalhes</Button>
          <Button size="small">Compras</Button>
        </CardActions>
      </Card>
    )
  }
}

export default compose(withRouter)(TeamDetail)
