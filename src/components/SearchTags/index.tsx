import React from 'react';
import { Tag } from 'antd';
import { TagType } from '../../types';
import './SearchTags.css';

interface SearchTagsProps {
  selectedTag: TagType;
  onTagChange: (tag: TagType) => void;
}

const allTags: TagType[] = [
  '全部', '股指', '金属', '能化', '农副', '油脂', '黑色',
  '中金所', '上交所', '深交所', '上期所', '大商所', '郑商所', 
  '能源中心', '广期所'
];

const SearchTags: React.FC<SearchTagsProps> = React.memo(({ selectedTag, onTagChange }) => {
  return (
    <div className="search-tags">
      <div className="search-tags-label">筛选：</div>
      <div className="search-tags-list">
        {allTags.map((tag) => (
          <Tag
            key={tag}
            className={`search-tag ${selectedTag === tag ? 'selected' : ''}`}
            onClick={() => onTagChange(tag)}
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
});

SearchTags.displayName = 'SearchTags';

export default SearchTags;

