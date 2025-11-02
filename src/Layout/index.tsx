import { Layout as AntLayout } from 'antd';
import type { ReactNode, CSSProperties } from 'react';
import Header from '@components/Header';
import './Layout.less';

const { Content: AntContent } = AntLayout;

interface LayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
}

const Layout = ({ children, className = '', contentClassName = '', contentStyle }: LayoutProps) => {
  return (
    <AntLayout className={`app-layout ${className}`}>
      <Header />
      <AntContent className={`app-content ${contentClassName}`} style={contentStyle}>
        {children}
      </AntContent>
    </AntLayout>
  );
};

export default Layout;

