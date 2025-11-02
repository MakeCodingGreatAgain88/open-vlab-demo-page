import { Spin } from 'antd';
import type { HotSection } from '@/types';
import HotSectionsDesktop from './HotSectionsDesktop';
import HotSectionsMobile from './HotSectionsMobile';
import './HotSections.css';

interface HotSectionsProps {
  data: HotSection[];
  loading: boolean;
}

const HotSections = memo<HotSectionsProps>(({ data, loading }: HotSectionsProps) => {
  if (loading) {
    return (
      <div className="hot-sections-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <HotSectionsDesktop data={data} />
      <HotSectionsMobile data={data} />
    </>
  );
});

HotSections.displayName = 'HotSections';

export default HotSections;

