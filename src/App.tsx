import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/Layout';
import Loading from '@components/Loading';
import MarketPageSkeleton from '@pages/Market/components/MarketPageSkeleton';
import './App.css';

// 使用 React.lazy 懒加载路由组件
const Market = lazy(() => import('@pages/Market'));
const MarketDetails = lazy(() => import('@pages/MarketDetails'));

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/market" replace />} />
        <Route 
          path="/market" 
          element={
            <Suspense fallback={<MarketPageSkeleton />}>
              <Market />
            </Suspense>
          } 
        />
        <Route 
          path="/market/:code" 
          element={
            <Suspense fallback={<Loading />}>
              <MarketDetails />
            </Suspense>
          } 
        />
      </Routes>
    </Layout>
  );
};

export default App;