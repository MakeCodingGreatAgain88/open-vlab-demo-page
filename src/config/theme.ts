import type { ThemeConfig } from 'antd';

// 欧易交易所暗黑色主题配置
export const themeConfig: ThemeConfig = {
  token: {
    // 主色：黑白主题（不使用蓝色）
    colorPrimary: '#FFFFFF',
    colorSuccess: 'rgb(8, 153, 129)', // 涨幅绿色
    colorError: 'rgb(239, 83, 80)',   // 跌幅红色
    colorWarning: '#F7B500',
    colorInfo: '#FFFFFF',
    
    // 背景色 - 纯黑主题
    colorBgContainer: '#000000',
    colorBgElevated: '#0A0A0A',
    colorBgLayout: '#000000',
    
    // 文字颜色 - 暗黑主题
    colorText: '#FFFFFF',
    colorTextSecondary: '#86909C',
    colorTextTertiary: '#6B7280',
    
    // 边框颜色 - 纯黑主题
    colorBorder: '#1A1A1A',
    colorBorderSecondary: '#0F0F0F',
    
    // 圆角
    borderRadius: 4,
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // 间距
    controlHeight: 36,
  },
  components: {
    Layout: {
      headerBg: '#000000',
      headerPadding: '0 24px',
      bodyBg: '#000000',
    },
    Menu: {
      itemSelectedBg: '#1A1A1A',
      itemSelectedColor: '#FFFFFF',
      itemHoverBg: '#0F0F0F',
      itemHoverColor: '#FFFFFF',
      itemActiveBg: '#1A1A1A',
      itemHeight: 48,
      itemColor: '#FFFFFF',
    },
    Table: {
      headerBg: '#0A0A0A',
      headerColor: '#FFFFFF',
      borderColor: 'transparent', // 设置边框颜色为透明
      rowHoverBg: '#0F0F0F',
      colorBgContainer: '#000000',
      colorText: '#FFFFFF',
      colorTextHeading: '#FFFFFF',
      // 移除行边框
      cellPaddingBlock: 0,
      cellPaddingInline: 0,
    },
    Card: {
      colorBgContainer: 'rgb(18, 18, 18)',
      colorBorderSecondary: '#1A1A1A',
      colorTextHeading: '#FFFFFF',
    },
    Button: {
      primaryShadow: '0 2px 4px rgba(255, 255, 255, 0.1)',
      // 默认按钮样式
      defaultBg: '#000000',
      defaultColor: '#FFFFFF',
      defaultBorderColor: '#1A1A1A',
      defaultHoverBg: '#0F0F0F',
      defaultHoverColor: '#FFFFFF',
      defaultHoverBorderColor: '#FFFFFF',
      defaultActiveBg: '#1A1A1A',
      defaultActiveColor: '#FFFFFF',
      defaultActiveBorderColor: '#FFFFFF',
      // Text 按钮样式
      textHoverBg: '#0F0F0F',
      // 通用样式
      colorText: '#FFFFFF',
      colorBgContainer: '#000000',
      colorBorder: '#1A1A1A',
      // Primary 按钮样式
      primaryColor: '#FFFFFF',
      // Disabled 状态
      colorTextDisabled: '#6B7280',
      colorBgContainerDisabled: '#0A0A0A',
    },
    Tag: {
      defaultBg: '#1A1A1A',
      defaultColor: '#FFFFFF',
    },
    Input: {
      colorBgContainer: '#0A0A0A',
      colorText: '#FFFFFF',
      colorBorder: '#1A1A1A',
    },
  },
};

