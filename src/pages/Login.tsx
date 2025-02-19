import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/slices/authSlice';
import { TEACHER_ACCOUNT } from '../constants/auth';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Check for teacher account first
    if (email === TEACHER_ACCOUNT.email && password === TEACHER_ACCOUNT.password) {
      dispatch(setUser({
        id: TEACHER_ACCOUNT.id,
        email: TEACHER_ACCOUNT.email,
        name: TEACHER_ACCOUNT.name,
        role: TEACHER_ACCOUNT.role
      }));
      navigate('/');
      return;
    }

    // For regular student users
    const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      dispatch(setUser({ id: user.id, email: user.email, role: user.role, name: user.name }));
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

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
        >
          Login
        </Button>

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