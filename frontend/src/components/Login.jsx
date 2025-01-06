import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// MUI Imports
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  CssBaseline,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Church, 
  AccountCircle, 
  Lock 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'light' 
    ? 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)'
    : theme.palette.background.default
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 400,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const Login = () => {
  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { nic, password });
      localStorage.setItem('token', res.data.token);
      navigate('/nominees');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <BackgroundBox>
      <CssBaseline />
      <Container maxWidth="xs">
        <LoginPaper elevation={6}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3 
          }}>
            <Church sx={{ 
              fontSize: 60, 
              color: 'primary.main',
              mb: 2 
            }} />
            <Typography component="h1" variant="h5">
              Church Presidential Election
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              sx={{ mt: 1 }}
            >
              Secure Login
            </Typography>
          </Box>

          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ 
                textAlign: 'center', 
                mb: 2, 
                width: '100%' 
              }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="National ID Number"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Sign In
            </Button>
          </Box>
        </LoginPaper>
      </Container>
    </BackgroundBox>
  );
};

export default Login;