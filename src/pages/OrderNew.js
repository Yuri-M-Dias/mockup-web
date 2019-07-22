import React, { Component, Fragment } from 'react'
import { withRouter, Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
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
  Icon,
  TextField,
} from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import { find, findIndex, orderBy } from 'lodash'
import { compose } from 'recompose'

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
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  fab: {
    margin: theme.spacing(1),
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
})

class OrderNew extends Component {
  state = {
    loading: true,
    products: [],
    cart: {
      price_penalty: 1,
      products: [],
    },
    total: 0,
  }

  componentDidMount() {
    this.getProducts()
  }

  async getProducts() {
    const { team_id } = this.props.match.params
    const products = await api.get('/products')
    this.setState({
      loading: false,
      products: products.data,
    })
  }

  addProductToCart(productID, event) {
    event.preventDefault()
    const product = {
      id: productID,
      quantity: event.target.value,
    }
    let cart = this.state.cart
    const existingProduct = findIndex(cart.products, { id: product.id })
    if (existingProduct >= 0) {
      cart.products[existingProduct] = product
      if (product.quantity < 1) cart.products.splice(existingProduct, 1)
    } else if (product.quantity > 0) {
      cart.products.push(product)
    }
    this.setState({
      cart: cart,
    })
    this.updateTotal()
  }

  updateTotal() {
    let cart = this.state.cart
    const expectedTotal = cart.products.reduce((agg, _) => {
      var product = this.state.products.find(p => p.id === _.id)
      return agg + product.base_price * cart.price_penalty * Number(_.quantity)
    }, 0)
    this.setState({
      total: expectedTotal,
    })
  }

  getCartProductQuantity(product_id) {
    const existingProduct = find(this.state.cart.products, { id: product_id })
    if (existingProduct) {
      return existingProduct.quantity
    } else {
      return 0
    }
  }

  handlePricePenaltyChange(e) {
    let newPenalty = Number(e.target.value)
    if (newPenalty < 1) return
    let cart = this.state.cart
    cart.price_penalty = newPenalty
    this.setState({
      cart: cart,
    })
    this.updateTotal()
  }

  sendCart = async e => {
    e.preventDefault()
    const { cart } = this.state
    const { team_id } = this.props.match.params
    try {
      const response = await api.post(`/teams/${team_id}/orders`, cart)
      return <Redirect to={`/teams/${team_id}`} />
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography>Carrinho de Compras</Typography>
          </Grid>
          <Grid item xs={12}>
            {this.state.products.length > 0 ? (
              <Paper elevation={1} className={classes.orders}>
                <List>
                  {orderBy(this.state.products, ['name'], ['desc']).map(
                    product => (
                      <ListItem className={classes.listItem} key={product.id}>
                        <ListItemText
                          primary={product.name}
                          secondary={`Preço: ${product.base_price}`}
                        />
                        <ListItemSecondaryAction>
                          <TextField
                            label="Qty"
                            value={this.getCartProductQuantity(product.id)}
                            onChange={e => this.addProductToCart(product.id, e)}
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            margin="normal"
                            variant="outlined"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  )}
                </List>
              </Paper>
            ) : (
              !this.state.loading && (
                <Typography variant="subheading">
                  Sem produtos para mostrar
                </Typography>
              )
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h3">Total: {this.state.total}</Typography>
            <TextField
              label="Penalidade"
              value={this.state.cart.price_penalty}
              onChange={e => this.handlePricePenaltyChange(e)}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <IconButton onClick={this.sendCart} color="inherit">
              <Typography>Send</Typography>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Fragment>
    )
  }
}

OrderNew.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default compose(
  withRouter,
  withStyles(styles)
)(OrderNew)
