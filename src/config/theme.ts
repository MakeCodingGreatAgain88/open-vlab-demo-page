import { ThemeConfig } from 'antd';

// 欧易交易所颜色风格主题配置
export const themeConfig: ThemeConfig = {
  token: {
    // 主色：欧易蓝
    colorPrimary: '#1B53E5',
    colorSuccess: 'rgb(8, 153, 129)', // 涨幅绿色
    colorError: 'rgb(239, 83, 80)',   // 跌幅红色
    colorWarning: '#F7B500',
    colorInfo: '#1B53E5',
    
    // 背景色
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F5F7FA',
    
    // 文字颜色
    colorText: '#1D2129',
    colorTextSecondary: '#86909C',
    
    // 边框颜色
    colorBorder: '#E5E6EB',
    colorBorderSecondary: '#F2F3F5',
    
    // 圆角
    borderRadius: 4,
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // 间距
    controlHeight: 36,
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      headerPadding: '0 24px',
      bodyBg: '#F5F7FA',
    },
    Menu: {
      itemSelectedBg: '#F0F5FF',
      itemSelectedColor: '#1B53E5',
      itemHoverBg: '#F0F5FF',
      itemHoverColor: '#1B53E5',
      itemActiveBg: '#E6F0FF',
      itemHeight: 48,
    },
    Table: {
      headerBg: '#FAFBFC',
      headerColor: '#1D2129',
      borderColor: '#E5E6EB',
      rowHoverBg: '#F7F8FA',
    },
    Button: {
      primaryShadow: '0 2px 4px rgba(27, 83, 229, 0.2)',
    },
    Tag: {
      defaultBg: '#F2F3F5',
      defaultColor: '#1D2129',
    },
  },
};

