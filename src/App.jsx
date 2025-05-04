import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import SignIn from './pages/SignIn';
import SchoolDashboard from './pages/SchoolDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import JobsPublic from './pages/JobsPublic';
import JobDetails from './pages/JobDetails';
import JobApplicationsPage from './pages/applications/JobApplicationsPage';

function App() {
  const { isAuthenticated, userType, isLoading, userData } = useSelector(state => state.auth);

  const determineUserType = () => {
    if (!userData?.user) return userType;
    
    if (userData.user.role === 'school_admin') {
      return 'school';
    } else if (userData.user.role === 'company_admin') {
      return 'company';
    } else if (userData.user.role === 'user') {
      return 'student';
    }
    
    return userType;
  };
  
  const actualUserType = determineUserType();

  const ProtectedRoute = ({ element, requiredUserType }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
    
    if (requiredUserType && actualUserType !== requiredUserType) {
      if (actualUserType === 'school') {
        return <Navigate to="/school/dashboard" replace />;
      } else if (actualUserType === 'company') {
        return <Navigate to="/company/dashboard" replace />;
      } else if (actualUserType === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
    
    return element;
  };

  const PublicOnlyRoute = ({ element }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (isAuthenticated) {
      if (actualUserType === 'school') {
        return <Navigate to="/school/dashboard" replace />;
      } else if (actualUserType === 'company') {
        return <Navigate to="/company/dashboard" replace />;
      } else if (actualUserType === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
    
    return element;
  };
  
  return (
    <div className="App container">
      <Navigation />
      
      <main className="py-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route 
            path="/signin" 
            element={<PublicOnlyRoute element={<SignIn />} />} 
          />
          <Route 
            path="/signup" 
            element={<PublicOnlyRoute element={<Signup />} />} 
          />
          <Route 
            path="/school/dashboard" 
            element={<ProtectedRoute element={<SchoolDashboard />} requiredUserType="school" />} 
          />
          <Route 
            path="/company/dashboard" 
            element={<ProtectedRoute element={<CompanyDashboard />} requiredUserType="company" />} 
          />
          <Route 
            path="/student/dashboard" 
            element={<ProtectedRoute element={<StudentDashboard />} requiredUserType="student" />} 
          />
          <Route path="/jobs/public" element={<JobsPublic />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route 
            path="/dashboard/applications/:jobId" 
            element={<ProtectedRoute element={<JobApplicationsPage />} />} 
          />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
