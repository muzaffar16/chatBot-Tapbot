import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Mainpg from './components/mainpg';      // main landing page
import Bot from './components/bot'; // chat / questions page
import Complain from './components/complain'
import Home from './components/home'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / landing */}
 <Route path="/" element={<Home />} /> 

        <Route path="/main" element={<Mainpg />} />

        {/* Ask Question page */}
        <Route path="/ask" element={<Bot />} />

        {/* Complain page */}
        <Route path="/complain" element={<Complain />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;