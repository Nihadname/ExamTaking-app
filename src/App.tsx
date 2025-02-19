import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExamCreation from './pages/ExamCreation';
import ExamTaking from './pages/ExamTaking';
import Results from './pages/Results';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import MyResults from './pages/MyResults';
import DetailedResults from './pages/DetailedResults';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/create-exam" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout>
                <ExamCreation />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/exam/:examId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <ExamTaking />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/results/:examId" element={
            <ProtectedRoute>
              <Layout>
                <Results />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/my-results" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <MyResults />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/detailed-results/:examId" element={<DetailedResults />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App; 