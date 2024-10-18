import React from 'react';
import { OverlayView } from '@react-google-maps/api';
import { Shop } from '@/types/shop';
import styles from './style.module.scss';

interface CustomMarkerProps {
  shop: Shop;
  position: google.maps.LatLngLiteral;
  isSelected: boolean;
  onClick: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ position, isSelected, onClick }) => {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.FLOAT_PANE}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -height,
      })}
    >
      <div
        className={`${styles.marker} ${isSelected ? styles.selected : ''}`}
        onClick={onClick}
      >
        <div className={styles.markerHead}>
          <img
            src={isSelected ? "/images/garden_logo_initial_orkney_font_navy.png" : "/images/garden_logo_initial_orkney_font.png"}
            alt="Logo"
            className={styles.logo}
          />
        </div>
        <div className={styles.markerTail}></div>
      </div>
    </OverlayView>
  );
};

export default CustomMarker;