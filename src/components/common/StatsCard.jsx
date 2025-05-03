import React from 'react';

const StatsCard = ({ value, label }) => {
  return (
    <div className="text-center">
      <h2 className="display-4">{value}</h2>
      <p className="text-muted">{label}</p>
    </div>
  );
};

export default StatsCard;
