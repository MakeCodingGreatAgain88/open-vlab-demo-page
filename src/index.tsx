import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './index.css';
import App from './App';
import { themeConfig } from '@config/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <App />
    </ConfigProvider>
  </StrictMode>
);

