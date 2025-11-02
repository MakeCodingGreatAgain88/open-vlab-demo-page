import type { HotSection } from '@/types';
import HotSectionsDesktop from './HotSectionsDesktop';
import HotSectionsMobile from './HotSectionsMobile';
import HotSectionsSkeleton from './HotSectionsSkeleton';
import './HotSections.css';

interface HotSectionsProps {
  data: HotSection[];
  loading?: boolean;
  skeletonLoading?: boolean;
}

const HotSections = memo<HotSectionsProps>(({ data, loading = false, skeletonLoading = false }: HotSectionsProps) => {
  if (skeletonLoading) {
    return (
      <>
        <HotSectionsSkeleton />
        <div className="hot-sections-mobile">
          <HotSectionsSkeleton />
        </div>
      </>
    );
  }

  // 直接传递 loading 给子组件，让 Table 显示 loading 遮罩层（保留已有数据）
  return (
    <>
      <HotSectionsDesktop data={data} loading={loading} />
      <HotSectionsMobile data={data} loading={loading} />
    </>
  );
});

HotSections.displayName = 'HotSections';

export default HotSections;

