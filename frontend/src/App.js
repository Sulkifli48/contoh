import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Pastikan Routes diimpor
import Home from './pages/js/Home';
import Admin from './pages/js/Admin';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    </Router>
);
};

export default App;