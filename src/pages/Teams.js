import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Typography,
  Button,
  IconButton,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Fab,
} from '@material-ui/core'
import {
  Add as AddIcon,
  ArrowRightAlt as ArrowRightIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'
import { orderBy } from 'lodash'
import { compose } from 'recompose'
import TeamEditor from '../components/TeamEditor'

import { isAuthenticated } from '../services/auth'
import api from '../services/api'

const styles = theme => ({
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

class Teams extends Component {
  state = {
    loading: true,
    teams: [],
    teamEditorOpen: false,
  }
  componentDidMount() {
    this.getTeams()
  }

  async getTeams() {
    const teams = await api.get('/teams')
    //TODO: validate?
    this.setState({
      loading: false,
      teams: teams.data,
    })
  }

  handleCloseTeamEditor = () => {
    this.getTeams()
    this.setState({
      teamEditorOpen: false,
    })
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        <Typography variant="h5">Times</Typography>
        {this.state.teams.length > 0 ? (
          <Grid container className={classes.root} spacing={5}>
            {orderBy(this.state.teams, ['total', 'name'], ['desc', 'asc']).map(
              team => (
                <Grid item xs sm key={team.id}>
                  <Card className={classes.card}>
                    <CardHeader title={team.name} />
                    <CardContent>
                      <Typography color="textPrimary" gutterBottom>
                        {team.total}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Link to={`/teams/${team.id}`}>
                        <IconButton color="inherit">
                          <Typography size="small">Detalhes</Typography>
                          <ArrowRightIcon />
                        </IconButton>
                      </Link>
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
        <Fab
          color="primary"
          aria-label="Add"
          onClick={e => this.setState({ teamEditorOpen: true })}
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
        <TeamEditor
          open={this.state.teamEditorOpen}
          handleClose={this.handleCloseTeamEditor}
        />
      </Fragment>
    )
  }
}

Teams.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default compose(
  withRouter,
  withStyles(styles)
)(Teams)
