import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/slices/authSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.some((u: any) => u.email === email)) {
      setError('Email already exists');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'student' as 'teacher' | 'student',
    };

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));

    // Log them in
    dispatch(setUser({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }));
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
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
          onClick={handleRegister}
          sx={{ mt: 3 }}
          disabled={!name || !email || !password}
        >
          Register
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/login" underline="hover">
            Already have an account? Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register; 