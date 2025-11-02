import { Skeleton } from 'antd';
import './DataTable.css';
import './DataTableSkeleton.css';

const DataTableSkeleton = () => {
  return (
    <div className="data-table-card data-table-skeleton">
      <Skeleton 
        active 
        paragraph={{ rows: 10 }} 
        title={false}
      />
    </div>
  );
};

export default DataTableSkeleton;

