// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Mainpg from './components/mainpg';      // full widget with buttons
import Bot from './components/bot';            // pure chat screen
import Complain from './components/complain';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:licenseKey" element={<Mainpg isPopup={false} />} />
        <Route path="/bot" element={<Bot isPopup={false} />} />
        <Route path="/complain" element={<Complain isPopup={false} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
