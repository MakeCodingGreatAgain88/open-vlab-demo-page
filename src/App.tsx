import { Layout } from 'antd';
import Header from '@components/Header';
import SearchTags from '@components/SearchTags';
import HotSections from '@components/HotSections';
import DataTable from '@components/DataTable';
import ErrorBoundary from '@components/ErrorBoundary';
import { useMarketData } from '@hooks/useMarketData';
import './App.css';

const { Content } = Layout;

const App = () => {
  const {
    selectedTag,
    setSelectedTag,
    hotSectionsData,
    tableData,
    loading,
  } = useMarketData();

  return (
    <ErrorBoundary>
      <Layout className="app-layout">
        <Header />
        <Content className="app-content">
          <div className="container">
            <ErrorBoundary>
              <SearchTags selectedTag={selectedTag} onTagChange={setSelectedTag} />
            </ErrorBoundary>
            <ErrorBoundary>
              <HotSections data={hotSectionsData} loading={loading} />
            </ErrorBoundary>
            <ErrorBoundary>
              <DataTable data={tableData} loading={loading} selectedTag={selectedTag} />
            </ErrorBoundary>
          </div>
        </Content>
      </Layout>
    </ErrorBoundary>
  );
};

export default App;

