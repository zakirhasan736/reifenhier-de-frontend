// components/CompareFloatingButton.tsx
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '@/store/compareSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { AppDispatch, RootState } from '@/store/store';
import Image from 'next/image';

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
        className="tooltip tooltip-left fixed right-3 top-1/2 -translate-y-1/2 z-40"
        data-tip="Anzeigen Vergleichen"
      >
        <button
          onClick={() => dispatch(openModal())}
          className="bg-primary-100 text-white border-2 border-mono-0 p-3 rounded-full shadow-lg cursor-pointer hover:bg-primary-200 transition-all"
          aria-label="Öffnen Vergleichen"
        >
          <Image
            src="/images/icons/arrow-swap-horizontal.svg"
            alt="Vergleichen"
            width={24}
            height={24}
          />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFloatingButton;
