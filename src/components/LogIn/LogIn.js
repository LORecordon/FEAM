import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Cambiar el tipo de fetch!!!!!!!!
async function gettok(uuu, ppp){
    try {const res = await fetch("http://192.168.10.151:3000/api/v1/api-keys", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            Username: uuu,
            Password: ppp
        })
    })
    const ttt = await res.json()
    const token = ttt.token
    localStorage.setItem("token",`Bearer ${token}`)
    return true;
    } catch {
        console.log("error")
        return false
    }
}
//FETCH CORRECTO
async function getttok(uuu, ppp){
  const creds = btoa(`${uuu}:${ppp}`);
  try {const res = await fetch("http://192.168.10.151:3000/api/v1/api-keys", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${creds}`
    }
  })
  const ttt = await res.json()
  const token = ttt.token
  console.log(token)
  localStorage.setItem("token",`Bearer ${token}`)
  localStorage.setItem("email", uuu)
  return true;
  } catch (err) {
      console.log("error")
      console.log(err)
      return false
  }
}

const defaultTheme = createTheme();

export default function LogIn() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const ddd = getttok(data.get("email"), data.get("password"))
    if (ddd){
      navigate("/")
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
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
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}