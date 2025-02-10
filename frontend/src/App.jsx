import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TicketCreate from './pages/TicketCreate';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TicketUpdate from './pages/TicketUpdate';
import PrivateRoute from './components/PrivateRoute'; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); 
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
      
        <Route path="/" element={<Login />} />
        
       
        <Route 
          path="/ticketCreate" 
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<TicketCreate />} />} 
        />
        <Route 
          path="/ticketUpdate" 
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<TicketUpdate />} />} 
        />
       
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



