import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ImageCard } from './ImageCard';
import type { MediaItem } from '../App';

interface ImageGalleryProps {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
}

export function ImageGallery({ items, onItemClick }: ImageGalleryProps) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3, 1440: 4, 1920: 6 }}
    >
      <Masonry gutter="20px">
        {items.map((item) => (
          <ImageCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}
