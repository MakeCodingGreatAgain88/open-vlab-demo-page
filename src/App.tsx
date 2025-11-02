import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import Loading from '@components/Loading';
import './App.css';

// 使用 React.lazy 懒加载路由组件
const Market = lazy(() => import('@pages/Market'));
const MarketDetails = lazy(() => import('@pages/MarketDetails'));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/market" replace />} />
        <Route path="/market" element={<Market />} />
        <Route path="/market/:code" element={<MarketDetails />} />
      </Routes>
    </Suspense>
  );
};

export default App;