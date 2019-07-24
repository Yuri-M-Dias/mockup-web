import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
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
} from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import { orderBy } from 'lodash'
import { compose } from 'recompose'
import ProductEditor from '../components/ProductEditor'
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog'

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
    margin: theme.spacing(1),
    position: 'absolute',
    bottom: 3 * theme.spacing.unit,
    right: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      bottom: 2 * theme.spacing.unit,
      right: 2 * theme.spacing.unit,
    },
  },
})

class ProductManager extends Component {
  state = {
    loading: true,
    products: [],
    productEditorOpen: false,
    confirmDialogOpen: false,
    product: null,
    error: '',
  }
  componentDidMount() {
    this.getProducts()
  }

  async getProducts() {
    const products = await api.get('/products')
    this.setState({
      loading: false,
      products: products.data,
    })
  }

  async deleteProduct(product_id) {
    try {
      const products = await api.delete(`/products/${product_id}`)
      this.setState({ product: null })
      this.getProducts()
    } catch (err) {
      this.setState({
        error: err.response.data,
      })
    }
  }

  handleCloseProductEditor = () => {
    this.getProducts()
    this.setState({
      productEditorOpen: false,
    })
  }

  handleChooseDeleteProduct = () => {
    this.setState({ confirmDialogOpen: false })
    this.deleteProduct(this.state.product.id)
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="display1">Informações dos Produtos</Typography>
          </Grid>
          <Grid item xs={12}>
            {this.state.products.length > 0 ? (
              <Paper elevation={1} className={classes.orders}>
                <List>
                  {orderBy(this.state.products, ['price'], ['desc']).map(
                    product => (
                      <ListItem className={classes.listItem} key={product.id}>
                        <ListItemText
                          primary={`${product.name} - ${product.created_at}`}
                          secondary={`Preço: ${product.base_price}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={e =>
                              this.setState({
                                confirmDialogOpen: true,
                                product: product,
                              })
                            }
                            color="inherit"
                          >
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
                  Sem produtos para mostrar
                </Typography>
              )
            )}
          </Grid>
          <Grid container item xs={12}>
            <Typography>{this.state.error}</Typography>
          </Grid>
        </Grid>
        <Fab
          color="primary"
          aria-label="Add"
          onClick={e => this.setState({ productEditorOpen: true })}
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
        <ProductEditor
          open={this.state.productEditorOpen}
          handleClose={this.handleCloseProductEditor}
        />
        <ConfirmDeleteDialog
          open={this.state.confirmDialogOpen}
          handleClose={e => this.setState({ confirmDialogOpen: false })}
          handleAgree={e => this.handleChooseDeleteProduct()}
        />
      </Fragment>
    )
  }
}

ProductManager.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default compose(
  withRouter,
  withStyles(styles)
)(ProductManager)
