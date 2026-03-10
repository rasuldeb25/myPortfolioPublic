import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router';

// --- 1. IMPORTS ---

import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';

// OLD PAGES (Named Exports -> Use Curly Braces {})
import { Home } from './pages/Home';
import { About } from './pages/About';
import { XVGTool } from './pages/XVGTool';

// NEW PAGES (Default Exports -> No Curly Braces)
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// --- 2. ROUTING MAP ---
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cv" element={<About />} /> {/* Redirects to About/CV page */}
        <Route path="/xvg-tool" element={<XVGTool />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;