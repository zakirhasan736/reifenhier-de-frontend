import React from 'react';
interface FavoriteOutlineIconProps {
  fillColor?: string; 
  strokeColor?: string;
}

const FavoriteOutlineIcon: React.FC<FavoriteOutlineIconProps> = ({
  fillColor = 'none',
  strokeColor = '#131313',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 16 15"
    fill={fillColor}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.91454 7.23221C1.1992 4.99888 2.0352 2.44621 4.37987 1.69088C5.6132 1.29288 6.97454 1.52755 7.99987 2.29888C8.96987 1.54888 10.3812 1.29555 11.6132 1.69088C13.9579 2.44621 14.7992 4.99888 14.0845 7.23221C12.9712 10.7722 7.99987 13.4989 7.99987 13.4989C7.99987 13.4989 3.0652 10.8135 1.91454 7.23221Z"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export default FavoriteOutlineIcon;
