import React from 'react';

const Welcome = () => {
  return (
    <div className="container mt-4">
      <div className="jumbotron bg-light p-5 rounded bg-opacity-75">
        <h1 className="display-4">Welcome to Student Power!</h1>
        <p className="lead">
          Your ultimate platform for academic success and collaboration.
        </p>
        <hr className="my-4" />
        <p>
          Explore our features to enhance your learning experience, connect with peers,
          and achieve your educational goals.
        </p>
        <button className="btn btn-lg mt-3" style={{ backgroundColor: '#3b53e4', color: '#ffffff' }}>
          Get Started
        </button>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
            <div className="card-body">
              <h5 className="card-title">Study Groups</h5>
              <p className="card-text">
                Join or create study groups with classmates to collaborate on assignments
                and prepare for exams together.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
            <div className="card-body">
              <h5 className="card-title">Resources</h5>
              <p className="card-text">
                Access a wide range of learning resources, materials, and tools
                to support your academic journey.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
            <div className="card-body">
              <h5 className="card-title">Mentorship</h5>
              <p className="card-text">
                Connect with mentors who can guide you through challenging
                subjects and academic decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
