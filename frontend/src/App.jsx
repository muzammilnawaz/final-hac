import React from 'react';
import { Routes, Route } from 'react-router-dom'; // BrowserRouter yahan se hata dein
import { Toaster } from 'react-hot-toast';
import { ContextProvider as AuthProvider } from './context/Context.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'; 
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UploadReport from './pages/UploadReport.jsx';
import AddVitals from './pages/AddVitals.jsx';
import ViewReport from './pages/ViewReport.jsx';
import Family from './pages/Family.jsx';
import Navbar from './components/layout/Navbar.jsx';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Navbar />
      <div className="pt-20"> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadReport />} />
            <Route path="/add-vitals" element={<AddVitals />} />
            <Route path="/family" element={<Family />} />
            <Route path="/report/:id" element={<ViewReport />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;