// ---------------------------
// 2. Hook for debounce dispatch (hooks/useDebouncedFetch.js)
// ---------------------------
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import debounce from 'lodash.debounce';

export const useDebouncedFetch = (params, delay = 500) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const debounced = debounce(() => {
            dispatch(fetchProducts(params));
        }, delay);

        debounced();
        return () => debounced.cancel();
    }, [params, dispatch, delay]);
};