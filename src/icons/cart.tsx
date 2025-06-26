'use client'
import React from 'react';

const CartIcon: React.FC = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 14 15" fill="none">
      <path
        d="M9.51527 6.20344V4.18211C9.51527 2.79277 8.38927 1.66677 7.0006 1.66677C5.61127 1.66077 4.47994 2.78144 4.47394 4.17077V4.18211V6.20344"
        stroke="#131313"
        style={{ stroke: '#131313', strokeOpacity: 1 }}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1615 14.0003H3.83852C2.27046 14.0003 1 12.7303 1 11.1637V7.48632C1 5.91966 2.27046 4.64966 3.83852 4.64966H10.1615C11.7295 4.64966 13 5.91966 13 7.48632V11.1637C13 12.7303 11.7295 14.0003 10.1615 14.0003Z"
        stroke="#131313"
        style={{ stroke: '#131313', strokeOpacity: 1 }}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CartIcon;
