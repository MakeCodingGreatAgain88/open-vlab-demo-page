import type { HotSection } from '@/types';
import HotSectionsDesktop from './HotSectionsDesktop';
import HotSectionsMobile from './HotSectionsMobile';
import HotSectionsSkeleton from './HotSectionsSkeleton';
import './HotSections.css';

interface HotSectionsProps {
  data: HotSection[];
  loading: boolean;
}

const HotSections = memo<HotSectionsProps>(({ data, loading }: HotSectionsProps) => {
  if (loading) {
    return (
      <>
        <HotSectionsSkeleton />
        <div className="hot-sections-mobile">
          <HotSectionsSkeleton />
        </div>
      </>
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

