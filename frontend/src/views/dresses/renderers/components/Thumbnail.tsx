import { KeyboardEvent, RefObject } from 'react';

import { model } from '@models';

import { getItemKey } from '../store';
import { DalleDressCard } from './DalleDressCard';

export interface ThumbnailProps {
  items: model.DalleDress[];
  selectedKey?: string | null;
  onItemClick?: (item: model.DalleDress) => void;
  onItemDoubleClick?: (item: model.DalleDress) => void;
  containerRef?: RefObject<HTMLDivElement | null>;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export const Thumbnail = ({
  items,
  selectedKey,
  onItemClick,
  onItemDoubleClick,
  containerRef,
  onKeyDown,
}: ThumbnailProps) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        overflowX: 'auto',
        padding: '4px 2px',
        marginTop: 4,
      }}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {items.map((item) => {
        const itemKey = getItemKey(item);
        return (
          <div
            key={itemKey}
            data-key={itemKey}
            style={{ width: 72, flex: '0 0 auto' }}
          >
            <DalleDressCard
              item={item}
              onClick={onItemClick}
              onDoubleClick={onItemDoubleClick}
              selected={itemKey === selectedKey}
            />
          </div>
        );
      })}
    </div>
  );
};
