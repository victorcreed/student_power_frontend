import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userType } = useSelector(state => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/signin');
  };

  const getDashboardLink = () => {
    const currentPath = window.location.pathname;
    const publicRoutes = ['/signin', '/signup', '/', '/about', '/contact'];
    
    if (!isAuthenticated) {
      return publicRoutes.includes(currentPath) ? currentPath : '/signin';
    }
    
    return userType === 'school' ? '/school/dashboard' : '/company/dashboard';
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
        <Link className="text-decoration-none" to="/">
          <h1 className="display-4 fw-bold m-0">
          <span style={{ color: ' #3b53e4' }}>Student </span>
          <span style={{ color: 'rgb(128, 0, 255)' }}>Power</span>
          </h1>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="btn me-2 text-white" style={{ backgroundColor: '#3b53e4'}} to="/">Home</Link>
            </li>
            
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="btn me-2 text-white" style={{ backgroundColor: '#3b53e4' }} to="/signin">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn text-white" style={{ backgroundColor: '#3b53e4' }} to="/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className="btn me-2 text-white"
                    style={{ backgroundColor: '#3b53e4' }} 
                    to={getDashboardLink()}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn text-white"
                    style={{ backgroundColor: '#3b53e4' }} 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
