'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch, useStore } from 'react-redux';
import store, { type AppDispatch, type RootState } from '../store/store';
import { UuidProvider } from '@/utils/uuidContext';
import PageViewTracker from '@/page-components/Home/PageViewTracker';
import CompareModal from '@/components/productpage/CompareModal';
import CompareTray from '@/components/productpage/CompareTray';
import {
  COMPARE_STORAGE_KEY,
  hydrateCompare,
  type CompareProduct,
} from '@/store/compareSlice';

function ComparePersist() {
  const reduxStore = useStore<RootState>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as CompareProduct[]) : [];
      dispatch(hydrateCompare(Array.isArray(parsed) ? parsed : []));
    } catch {
      dispatch(hydrateCompare([]));
    }

    let prev = '';
    return reduxStore.subscribe(() => {
      try {
        const next = JSON.stringify(reduxStore.getState().compare.products);
        if (next === prev) return;
        prev = next;
        window.localStorage.setItem(COMPARE_STORAGE_KEY, next);
      } catch {
        // ignore quota / private mode
      }
    });
  }, [dispatch, reduxStore]);

  return null;
}

const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <UuidProvider>
        <ComparePersist />
        <PageViewTracker />
        {children}
        <CompareTray />
        <CompareModal />
      </UuidProvider>
    </Provider>
  );
};

export default ClientProviders;
