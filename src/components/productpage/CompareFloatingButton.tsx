// components/CompareFloatingButton.tsx
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '@/store/compareSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { AppDispatch, RootState } from '@/store/store';

const CompareFloatingButton = () => {
 const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.compare.products);

  if (products.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="compare-float"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="tooltip fixed right-3 top-1/2 -translate-y-1/2 z-40"
        data-tip="View Compare"
      >
        <button
          onClick={() => dispatch(openModal())}
          className="bg-primary-100 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-primary-200 transition-all"
          aria-label="Open Compare"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFloatingButton;
