import { Routes, Route, Navigate } from 'react-router-dom';
import Market from '@pages/Market';
import MarketDetails from '@pages/MarketDetails';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/market" replace />} />
      <Route path="/market" element={<Market />} />
      <Route path="/market/:code" element={<MarketDetails />} />
    </Routes>
  );
};

export default App;