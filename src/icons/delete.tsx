import React from 'react';

interface DeleteIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({
  width = 14,
  height = 14,
  color = '#611192',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M11.8833 5.3125C11.8833 5.3125 11.5213 9.8025 11.3113 11.6938C11.2113 12.5972 10.6533 13.1265 9.73927 13.1432C7.99994 13.1745 6.25861 13.1765 4.51994 13.1398C3.64061 13.1218 3.09194 12.5858 2.99394 11.6985C2.78261 9.7905 2.42261 5.3125 2.42261 5.3125"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8055 3.15951H1.50014"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6271 3.15998C10.1037 3.15998 9.65307 2.78998 9.55041 2.27732L9.38841 1.46665C9.28841 1.09265 8.94974 0.833984 8.56374 0.833984H5.74174C5.35574 0.833984 5.01707 1.09265 4.91707 1.46665L4.75507 2.27732C4.65241 2.78998 4.20174 3.15998 3.67841 3.15998"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DeleteIcon;
