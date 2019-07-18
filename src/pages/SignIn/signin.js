import React, { Component } from 'react'
import { Link as RouterLink, withRouter } from 'react-router-dom'

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Container,
  Typography,
  Box,
  Link,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import api from '../../services/api'
import { login } from '../../services/auth'

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  }

  handleSignIn = async e => {
    e.preventDefault()
    const { email, password } = this.state
    if (!email || !password) {
      this.setState({ error: 'Preencha e-mail e senha para continuar!' })
    } else {
      try {
        const response = await api.post('/sessions', { email, password })
        login(response.data.token)
        this.props.history.push('/app')
      } catch (err) {
        this.setState({
          error:
            'Houve um problema com o login, verifique suas credenciais. T.T',
        })
      }
    }
  }

  classes = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }))

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {this.state.error && <p>{this.state.error}</p>}
        <div className={this.classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={this.classes.form}
            onSubmit={this.handleSignIn}
            noValidate
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={e => this.setState({ email: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => this.setState({ password: e.target.value })}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <RouterLink to="/signup">
                  <Link variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </RouterLink>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    )
  }
}

export default withRouter(SignIn)
