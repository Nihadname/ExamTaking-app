import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/slices/authSlice';
import { TEACHER_ACCOUNT } from '../constants/auth';
import { RootState } from '../store';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogin = () => {
    // Check for teacher account first
    if (email === TEACHER_ACCOUNT.email && password === TEACHER_ACCOUNT.password) {
      dispatch(setUser({
        id: TEACHER_ACCOUNT.id,
        email: TEACHER_ACCOUNT.email,
        name: TEACHER_ACCOUNT.name,
        role: TEACHER_ACCOUNT.role
      }));
      return;
    }

    // For regular student users
    const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      dispatch(setUser({ id: user.id, email: user.email, role: user.role, name: user.name }));
    } else {
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ mt: 3 }}
          disabled={!email || !password}
        >
          Login
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/register" underline="hover">
            Don't have an account? Register
          </Link>
        </Box>

        <Typography sx={{ mt: 2, textAlign: 'center' }} color="textSecondary">
          Teacher Login: {TEACHER_ACCOUNT.email}
          <br />
          Password: {TEACHER_ACCOUNT.password}
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login; 