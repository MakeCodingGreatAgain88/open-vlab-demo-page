import { Layout } from 'antd';
import Header from '@components/Header';
import SearchTags from '@components/SearchTags';
import HotSections from '@components/HotSections';
import DataTable from '@components/DataTable';
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
    <Layout className="app-layout">
      <Header />
      <Content className="app-content">
        <div className="container">
          <SearchTags selectedTag={selectedTag} onTagChange={setSelectedTag} />
          <HotSections data={hotSectionsData} loading={loading} />
          <DataTable data={tableData} loading={loading} selectedTag={selectedTag} />
        </div>
      </Content>
    </Layout>
  );
};

export default App;

