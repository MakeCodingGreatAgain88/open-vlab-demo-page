import { Tag, Skeleton } from 'antd'
import type { TagType } from '@/types'
import './SearchTags.css'

// 导入图标
import stockIndexIcon from '@assets/icon/stock-index.svg'
import nobleMetalIcon from '@assets/icon/noble-metal.svg'
import chemicalIcon from '@assets/icon/chemical.svg'
import agriculturalIcon from '@assets/icon/agricultural.svg'
import oilIcon from '@assets/icon/oil.svg'
import ferrousIcon from '@assets/icon/ferrous.svg'

interface SearchTagsProps {
    selectedTag: TagType;
    onTagChange: (tag: TagType) => void;
    skeletonLoading?: boolean;
}

const allTags: TagType[] = [ '全部', '股指', '金属', '能化', '农副', '油脂', '黑色', '中金所', '上交所','深交所','上期所','大商所','郑商所','能源中心','广期所' ]

// 标签到图标的映射
const tagIconMap: Record<TagType, string | null> = {
    '全部': null,
    '股指': stockIndexIcon,
    '金属': nobleMetalIcon,
    '能化': chemicalIcon,
    '农副': agriculturalIcon,
    '油脂': oilIcon,
    '黑色': ferrousIcon,
    '中金所': stockIndexIcon,
    '上交所': stockIndexIcon,
    '深交所': stockIndexIcon,
    '上期所': stockIndexIcon,
    '大商所': stockIndexIcon,
    '郑商所': stockIndexIcon,
    '能源中心': stockIndexIcon,
    '广期所': stockIndexIcon
}

const SearchTags = memo<SearchTagsProps>(({selectedTag, onTagChange, skeletonLoading = false}: SearchTagsProps) => {
    if (skeletonLoading) {
        return (
            <div className="search-tags-wrapper">
                {/* 标题骨架 */ }
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
                {/* 标签列表骨架 */ }
                <div className="search-tags-list">
                    { allTags.map(( tag) => (
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
        )
    }

    return (
        <div className="search-tags-wrapper">
            <div className="search-tags-title">板块筛选</div>
            <div className="search-tags">
                <div className="search-tags-list">
                    { allTags.map((tag) => {
                        const icon = tagIconMap[tag]
                        return (
                            <Tag
                                key={ tag }
                                className={ `search-tag ${ selectedTag === tag ? 'selected' : '' }` }
                                onClick={ () => onTagChange(tag) }
                            >
                                { icon && (
                                    <img
                                        src={ icon }
                                        alt={ tag }
                                        className="search-tag-icon"
                                    />
                                ) }
                                <span>{ tag }</span>
                            </Tag>
                        )
                    }) }
                </div>
            </div>
        </div>
    )
})

SearchTags.displayName = 'SearchTags'

export default SearchTags

