import React from 'react';
import Button from '../common/Button';

const withJobActions = (Component) => {
  return function EnhancedComponent({
    job,
    isApplying,
    selectedJob,
    onApply,
    onView,
    showApplyButton = true,
    ...props
  }) {
    const jobApplied = job.isApplied || job.hasApplied;
    
    return (
      <Component
        renderActions={() => (
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => onView(job.id)}
            >
              View
            </Button>
            {showApplyButton && !jobApplied ? (
              <Button 
                variant="success" 
                size="sm"
                onClick={() => onApply(job.id)}
                disabled={isApplying && selectedJob === job.id}
              >
                {isApplying && selectedJob === job.id ? 'Applying...' : 'Apply'}
              </Button>
            ) : showApplyButton && jobApplied ? (
              <Button 
                variant="outline-success" 
                size="sm"
                disabled
              >
                Applied
              </Button>
            ) : null}
          </div>
        )}
        job={job}
        {...props}
      />
    );
  };
};

export default withJobActions;
