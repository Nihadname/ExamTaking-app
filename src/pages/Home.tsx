import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
});

function Home() {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#e3f2fd' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to the Exam System
      </Typography>
      <Typography variant="h6" align="center" paragraph>
        A comprehensive platform for creating, taking, and reviewing exams.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Register
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create an account to start taking exams and track your progress.
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to="/register" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </CardActions>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StyledCard elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Login
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Already have an account? Log in to access your dashboard and exams.
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to="/login" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </CardActions>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StyledCard elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Learn More
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Discover how our platform can help you create and manage exams effectively.
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to="/about" variant="contained" color="primary" fullWidth>
                Learn More
              </Button>
            </CardActions>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home; 