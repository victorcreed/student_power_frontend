import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userType } = useSelector(state => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/signin');
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/signin';
    return userType === 'school' ? '/school/dashboard' : '/company/dashboard';
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
        <Link className="text-decoration-none" to="/">
          <h1 className="display-4 fw-bold m-0">
          <span style={{ color: '#3b53e4' }}>Power </span>
          <span className="text-dark fw-normal">of the </span>
          <span style={{ color: '#3b53e4' }}>Students</span>
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
              <Link className="btn me-2" style={{ backgroundColor: '#3b53e4', color: '#ffffff' }} to="/">Home</Link>
            </li>
            
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="btn me-2" style={{ backgroundColor: '#3b53e4' }} to="/signin">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn" style={{ backgroundColor: '#3b53e4' }} to="/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className="btn me-2"
                    style={{ backgroundColor: '#3b53e4', color: '#ffffff' }} 
                    to={getDashboardLink()}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn"
                    style={{ backgroundColor: '#3b53e4', color: '#ffffff' }} 
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
