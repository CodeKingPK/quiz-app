import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/common/Home';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import Exams from './pages/admin/Exams';
import AddEditExam from './pages/admin/Exams/AddEditExam';
import WriteExam from './pages/user/WriteExam';
import UserReports from './pages/user/UserReports';
import AdminReports from './pages/admin/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import './stylesheets/theme.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams/add"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams/edit/:id"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/write-exam/:id"
            element={
              <ProtectedRoute>
                <WriteExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute>
                <UserReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;