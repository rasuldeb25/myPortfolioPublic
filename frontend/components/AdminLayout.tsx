import React from 'react';
import { Outlet } from 'react-router';

export const AdminLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
