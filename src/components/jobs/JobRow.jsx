import React from 'react';
import StatusBadge from './StatusBadge';

const JobRow = ({ job, renderActions }) => {
  return (
    <tr>
      <td>{job.title}</td>
      <td>{job.company?.name || 'Unknown'}</td>
      <td>
        <StatusBadge status={job.status} />
      </td>
      <td>
        {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiration'}
      </td>
      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
      <td>{renderActions()}</td>
    </tr>
  );
};

export default JobRow;
