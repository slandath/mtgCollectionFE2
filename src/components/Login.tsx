import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Footer from './Footer';
import { Button, TextField, Container, Box, Typography } from '@mui/material/';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './material ui/Theme';
import { useMutation } from '@tanstack/react-query';
import { getTokenDuration } from '../utils/auth';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

type LoginCredentials = {
  username: string;
  password: string;
};

function Login() {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  // useNavigate hook from React Router
  const navigate = useNavigate();

  // ENV Variables
  const baseURL = import.meta.env.VITE_APIURL;

  // Login
  const { mutate } = useMutation({
    mutationFn: login,
  });

  async function login(body: LoginCredentials) {
    const response = await fetch(`${baseURL}/api/v1/login`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status != 200) {
      alert('User not found');
      setDisabled(false);
    } else {
      const commits = await response.json();
      localStorage.setItem('token', commits.token);
      localStorage.setItem('refreshToken', commits.refreshToken);
// Creating an entry in local storage for the access token lifespan.  This is set manually and is not reading the contents of the JWT.
      const expiration = new Date()
      expiration.setMinutes(expiration.getMinutes() + 30)
      localStorage.setItem('expiration', expiration.toISOString())
      navigate('collection')
  }}

  function handleClick() {
    setDisabled(true);
    const loginObject: LoginCredentials = {
      username: `${credentials?.username}`,
      password: `${credentials?.password}`,
    };
    mutate(loginObject);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <>
      <ThemeProvider theme={Theme}>
        <Container maxWidth="md">
          <Typography variant="h1" align="center" sx={{ mt: 2 }}>
            MTG Collection App
          </Typography>
          <form>
            <Box
              sx={{
                display: 'block',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextField
                required
                variant="outlined"
                margin="normal"
                label="Username"
                id="username"
                name="username"
                type="text"
                sx={{ width: '100%' }}
                onChange={handleChange}
              />
              <TextField
                required
                variant="outlined"
                margin="normal"
                label="Password"
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                sx={{ width: '100%' }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onClick={handleClick}
                disabled={disabled}
              >
                {disabled === false ? 'Login' : 'Loading...'}
              </Button>
            </Box>
          </form>
          <br />
          <Button
            variant="contained"
            onClick={() => {
              navigate('/account');
            }}
            sx={{
              display: 'flex',
              margin: 'auto',
            }}
            disabled={disabled}
          >
            Create Account
          </Button>
          <br />
        </Container>
      </ThemeProvider>
      <Footer />
    </>
  );
}
export default Login;
