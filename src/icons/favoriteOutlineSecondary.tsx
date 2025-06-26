import React from 'react';
interface FavoriteOutlineIconProps {
  fillColor?: string; // Optional prop for the fill color
}

const FavoriteOutlineSecondaryIcon: React.FC<FavoriteOutlineIconProps> = ({
  fillColor = 'none',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 16 14"
      fill={fillColor}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.91466 6.73221C1.19932 4.49888 2.03532 1.94621 4.37999 1.19088C5.61332 0.792881 6.97466 1.02755 7.99999 1.79888C8.96999 1.04888 10.3813 0.795548 11.6133 1.19088C13.958 1.94621 14.7993 4.49888 14.0847 6.73221C12.9713 10.2722 7.99999 12.9989 7.99999 12.9989C7.99999 12.9989 3.06532 10.3135 1.91466 6.73221Z"
        stroke="#611192"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: '#611192' }}
      />
    </svg>
  );
};

export default FavoriteOutlineSecondaryIcon;
