import { Card, Skeleton, Table } from 'antd'
import './HotSections.css'
import './HotSectionsSkeleton.css'

const HotSectionsSkeleton = () => {
    // 与实际的标题文本保持一致
    const sectionTitles = [ '隐波最大上升', '隐波最大下降', '波动率溢价最高', '波动率溢价最低' ]

    // 创建与真实表格完全相同的列结构
    const skeletonColumns = [
        {
            title: '名称',
            key: 'name',
            width: 80,
            fixed: 'left' as const,
            className: 'hot-section-col-name',
            render: () => (
                <div className="flex items-center gap-1.5">
                    <Skeleton.Avatar active size={ 16 } shape="square"
                                     style={ {backgroundColor: '#1A1A1A', flexShrink: 0} }/>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <Skeleton.Input active size="small" style={ {
                            width: '60px',
                            height: '12px',
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #2A2A2A'
                        } }/>
                        <Skeleton.Input active size="small" style={ {
                            width: '40px',
                            height: '10px',
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #2A2A2A'
                        } }/>
                    </div>
                </div>
            )
        },
        {
            title: '标的涨幅%',
            key: 'price',
            width: 90,
            className: 'hot-section-col-price',
            render: () => (
                <Skeleton.Input active size="small" style={ {
                    width: '70px',
                    height: '16px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A'
                } }/>
            )
        },
        {
            title: '隐波变化',
            key: 'vol',
            width: 90,
            className: 'hot-section-col-vol',
            render: () => (
                <Skeleton.Input active size="small" style={ {
                    width: '70px',
                    height: '16px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A'
                } }/>
            )
        },
        {
            title: '分时预览',
            key: 'chart',
            width: 120,
            className: 'hot-section-col-chart',
            render: () => (
                <div className="hot-section-chart-wrapper">
                    <Skeleton.Input active size="small" style={ {
                        width: '100px',
                        height: '40px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #2A2A2A'
                    } }/>
                </div>
            )
        }
    ]

    // 5行数据，与实际数据一致
    const skeletonData = Array(5).fill({key: 0}).map((_, i) => ({key: i}))

    return (
        <div className="hot-sections-desktop hot-sections-skeleton">
            { sectionTitles.map((title) => (
                <Card
                    key={ title }
                    className="hot-section-card"
                    size="small"
                    style={ {height: '432px', display: 'flex', flexDirection: 'column'} }
                    title={
                        <Skeleton.Input
                            active
                            size="small"
                            style={ {
                                height: '14px',
                                backgroundColor: '#1A1A1A',
                                border: '1px solid #2A2A2A'
                            } }
                        />
                    }
                >
                    <Table
                        dataSource={ skeletonData }
                        columns={ skeletonColumns }
                        pagination={ false }
                        rowKey="key"
                        size="small"
                        bordered={ false }
                        style={ {flex: 1} }
                    />
                </Card>
            )) }
        </div>
    )
}

export default HotSectionsSkeleton

