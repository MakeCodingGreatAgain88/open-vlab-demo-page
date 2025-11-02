import { Layout } from 'antd';
import Header from '@components/Header';
import SearchTags from '@components/SearchTags';
import HotSections from '@components/HotSections';
import DataTable from '@components/DataTable';
import ErrorBoundary from '@components/ErrorBoundary';
import { useMarketData } from '@hooks/useMarketData';

const { Content } = Layout;

const Market = () => {
  const {
    selectedTag,
    setSelectedTag,
    hotSectionsData,
    tableData,
    loading,
  } = useMarketData();

  return (
    <ErrorBoundary>
      <Layout className="min-h-screen">
        <Header />
        <Content 
          className="w-full max-w-full overflow-x-hidden"
          style={{ padding: '24px' }}
        >
          <div className="w-full max-w-full overflow-x-hidden">
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

export default Market;
