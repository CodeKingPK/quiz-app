import React from 'react';

function PageTitle({ title }) {
  return (
    <div className="premium-header">
      <h1 style={{ margin: 0, color: 'var(--gray-900)', fontSize: '1.75rem', fontWeight: '700' }}>
        {title}
      </h1>
    </div>
  );
}

export default PageTitle;
