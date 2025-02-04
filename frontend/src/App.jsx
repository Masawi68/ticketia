import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TicketCreate from './pages/TicketCreate';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TicketUpdate from './pages/TicketUpdate';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // Set login state based on token presence
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public route for Login */}
        <Route path="/" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/ticketCreate" 
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<TicketCreate />} />} 
        />
        <Route 
          path="/ticketUpdate" 
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<TicketUpdate />} />} 
        />
        {/* <Route 
          path="/TicketUpdate/:ticketId" 
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<TicketUpdate />} />} 
        /> */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<DashBoard />} />} 
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;



