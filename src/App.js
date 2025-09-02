import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './pages/WelcomeScreen/WelcomeScreen';
import PlayerHub from './pages/PlayerHub/PlayerHub';
import MockDraft from './pages/MockDraft/MockDraft';

function App() {
  console.log('App component rendering - FULL APP');
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/draftroom" element={<WelcomeScreen />} />
          <Route path="/hub" element={<PlayerHub />} />
          <Route path="/draft" element={<MockDraft />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
