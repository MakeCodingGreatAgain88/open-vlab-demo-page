import { Spin } from 'antd';

interface LoadingProps {
    tip?: string;
    size?: 'small' | 'default' | 'large';
    fullScreen?: boolean;
}

// 通用加载组件，使用 Spin
const Loading = ({ 
    tip = '加载中...', 
    size = 'large',
    fullScreen = true 
}: LoadingProps) => {
    return (
        <div 
            className="w-full bg-black flex items-center justify-center"
            style={{ 
                height: fullScreen ? '100vh' : '400px',
                minHeight: fullScreen ? '100vh' : '400px'
            }}
        >
            <Spin size={size} tip={tip} />
        </div>
    );
};

export default Loading;

