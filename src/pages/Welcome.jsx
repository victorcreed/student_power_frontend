import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicJobs } from '../store/slices/jobsSlice';

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-success';
    case 'expired': return 'bg-warning';
    case 'draft': return 'bg-info';
    case 'closed': return 'bg-secondary';
    default: return 'bg-primary';
  }
};

const InfoCard = ({ title, text, link, linkText }) => (
  <div className="card h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{text}</p>
      {Array.isArray(linkText) && (
        <ul className="mb-0">
          {linkText.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      )}
    </div>
    {link && (
      <div className="card-footer bg-transparent">
        <Link to={link} className="text-decoration-none">
          {Array.isArray(linkText) ? `Explore ${title.toLowerCase()} →` : linkText}
        </Link>
      </div>
    )}
  </div>
);

const JobListTable = ({ jobs, isLoading, error }) => {
  if (isLoading) return <div className="text-center py-4">Loading jobs...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Status</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs && jobs.length > 0 ? (
            jobs.map(job => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.Company?.name || 'Unknown'}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td>{job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiration'}</td>
                <td>
                  <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-primary">
                    View Details
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No jobs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Welcome = () => {
  const dispatch = useDispatch();
  const selectJobsState = state =>
    state.jobs ||
    state.jobsSlice ||
    (state.slices && state.slices.jobs) ||
    {};

  const { jobs = [], status, error, count = 0 } = useSelector(selectJobsState);
  useEffect(() => {
    dispatch(fetchPublicJobs());
  }, [dispatch]);

  const isLoading = status === 'loading';

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

      {/* Feature Cards */}
      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <InfoCard
            title="Study Groups"
            text="Join or create study groups with classmates to collaborate on assignments and prepare for exams together."
          />
        </div>
        <div className="col-md-4 mb-4">
          <InfoCard
            title="Resources"
            text="Access a wide range of learning resources, materials, and tools to support your academic journey."
          />
        </div>
        <div className="col-md-4 mb-4">
          <InfoCard
            title="Mentorship"
            text="Connect with mentors who can guide you through challenging subjects and academic decisions."
          />
        </div>
      </div>

      {/* Available Jobs Table */}
      <div className="row mt-5 mb-4">
        <div className="col-12">
          <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
            <div className="text-white p-2 rounded d-flex justify-content-between align-items-center" 
              style={{ backgroundColor: '#3b53e4'}}
            >
              <p className="mb-0 fs-4">Available Job Opportunities</p>
              <Link to="/jobs/public" className="btn btn-light btn-sm">View All</Link>
            </div>
            <div className="card-body">
              <JobListTable jobs={jobs} count={count} isLoading={isLoading} error={error} />
            </div>
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  {!isLoading && !error && (jobs?.length > 0 ? `Showing ${jobs.length} of ${count} jobs` : 'No jobs available')}
                </span>
                <Link to="/jobs/public" className="btn btn-primary"
                style={{ backgroundColor: '#3b53e4'}}
                >Browse All Jobs</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource/Partnership Cards */}
      <div className="row mt-5 mb-4">
        <div className="col-md-6 mb-4">
           <InfoCard
            title="Job Search Resources"
            text="Our platform offers tools to help you find the perfect job opportunity:"
            linkText={[
              "Resume building assistance",
              "Interview preparation guides",
              "Career counseling sessions",
              "Industry networking events"
            ]}
            link="/resources"
          />
        </div>
        <div className="col-md-6 mb-4">
          <InfoCard
            title="School Partnerships"
            text="We partner with schools and educational institutions to provide exclusive opportunities for students:"
            linkText={[
              "School-approved job listings",
              "Campus recruitment events",
              "Academic credit for internships",
              "Faculty-recommended positions"
            ]}
            link="/schools"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
