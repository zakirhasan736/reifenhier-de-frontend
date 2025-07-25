import debounce from 'lodash.debounce';

export function debounceAsync(fn, wait = 400) {
  const debounced = debounce((resolve, ...args) => {
    fn(...args).then(resolve);
  }, wait);

  return (...args) =>
    new Promise(resolve => {
      debounced(resolve, ...args);
    });
}

