import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import {
  Grid,
  withStyles,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
} from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import { orderBy } from 'lodash'
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

class OrderDetail extends Component {
  state = {
    loading: true,
    order: {},
  }

  componentDidMount() {
    this.getOrder()
  }

  async getOrder() {
    const { team_id, order_id } = this.props.match.params
    const order = await api.get(`/teams/${team_id}/orders/${order_id}`)
    this.setState({
      loading: false,
      order: order.data[0], // HACK!
    })
  }

  render() {
    const { classes } = this.props
    const { team_id, order_id } = this.props.match.params
    return (
      <Fragment>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography>Informações do Carrinho</Typography>
          </Grid>
          <Grid item xs={12}>
            {this.state.order ? (
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs={6}>
                  <Typography>
                    Penalidade: {this.state.order.price_penalty}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Total: {this.state.order.total}</Typography>
                </Grid>
                <Grid item xs={12}>
                  {this.state.order.products ? (
                    <Paper elevation={1} className={classes.orders}>
                      <List>
                        {orderBy(
                          this.state.order.products,
                          ['pivot.quantity'],
                          ['desc']
                        ).map(product => (
                          <ListItem
                            className={classes.listItem}
                            key={product.id}
                            button
                            component={Link}
                            to={`/products/${product.id}`}
                          >
                            <ListItemText
                              primary={product.name}
                              secondary={`${product.pivot.quantity} por ${product.base_price}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton onClick={() => null} color="inherit">
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  ) : (
                    !this.state.loading && (
                      <Typography variant="subheading">
                        Sem compras feitas até o momento!
                      </Typography>
                    )
                  )}
                </Grid>
              </Grid>
            ) : (
              !this.state.loading && (
                <Typography variant="subheading">Time inválido</Typography>
              )
            )}
          </Grid>
        </Grid>
        <Link to={`/teams/${team_id}/orders/new`}>
          <Fab color="primary" aria-label="Add" className={classes.fab}>
            <AddIcon />
          </Fab>
        </Link>
      </Fragment>
    )
  }
}

OrderDetail.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default compose(
  withRouter,
  withStyles(styles)
)(OrderDetail)
