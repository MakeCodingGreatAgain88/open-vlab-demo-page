import { Spin } from 'antd';

interface LoadingProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
  fullScreen?: boolean;
}

const Loading = ({ 
  tip = '加载中...', 
  size = 'large',
  fullScreen = true 
}: LoadingProps) => {
  return (
    <div 
      className="flex items-center justify-center w-full bg-black"
      style={{ 
        height: fullScreen ? '100vh' : '400px',
        minHeight: fullScreen ? '100vh' : '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loading;

