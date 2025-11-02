import { Layout, Skeleton } from 'antd'
import Header from '@components/Header'
import HotSectionsSkeleton from '@components/HotSections/HotSectionsSkeleton'
import DataTableSkeleton from '@components/DataTable/DataTableSkeleton'
import '@components/SearchTags/SearchTags.less'
import './MarketPageSkeleton.less'

const {Content} = Layout

// 搜索标签骨架图
const SearchTagsSkeleton = () => {
    const allTags = [ '全部', '股指', '金属', '能化', '农副', '油脂', '黑色' ]

    return (
        <div className="search-tags">
            <div className="search-tags-wrapper">
            <Skeleton.Input
                active
                size="small"
                style={ {
                    width: '80px',
                    height: '16px',
                    marginBottom: '12px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '4px'
                } }
            />
            <div className="search-tags-list">
                { allTags.map((tag) => (
                    <Skeleton.Input
                        key={ tag }
                        active
                        size="small"
                        style={ {
                            height: '34px',
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #2A2A2A',
                            borderRadius: '4px'
                        } }
                    />
                )) }
            </div>
            </div>
        </div>
    )
}

const MarketPageSkeleton = () => {
    return (
        <Layout className="min-h-screen">
            <Header/>
            <Content
                className="w-full max-w-full overflow-x-hidden"
                style={ {padding: '24px'} }
            >
                <div className="w-full max-w-full overflow-x-hidden">
                    <SearchTagsSkeleton/>
                    <HotSectionsSkeleton/>
                    <DataTableSkeleton/>
                </div>
            </Content>
        </Layout>
    )
}

export default MarketPageSkeleton

