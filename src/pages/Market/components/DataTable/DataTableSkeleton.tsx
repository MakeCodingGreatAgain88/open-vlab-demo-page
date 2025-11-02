import { Skeleton } from 'antd';
import './DataTable.less';
import './DataTableSkeleton.less';

const DataTableSkeleton = () => {
  return (
    <div className="data-table">
      <div className="data-table-card data-table-skeleton">
      <Skeleton 
        active 
        paragraph={{ rows: 10 }} 
        title={false}
      />
      </div>
    </div>
  );
};

export default DataTableSkeleton;

