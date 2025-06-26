import React from 'react';

const Checkmark: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.8047 3.52861C14.0651 3.78896 14.0651 4.21107 13.8047 4.47141L6.4714 11.8047C6.21106 12.0651 5.78894 12.0651 5.5286 11.8047L2.19526 8.47141C1.93491 8.21107 1.93491 7.78896 2.19526 7.52861C2.45561 7.26826 2.87772 7.26826 3.13807 7.52861L6 10.3905L12.8619 3.52861C13.1223 3.26826 13.5444 3.26826 13.8047 3.52861Z"
        fill="white"
      />
    </svg>
  );
};

export default Checkmark;
