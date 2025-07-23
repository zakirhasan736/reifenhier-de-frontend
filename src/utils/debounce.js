import debounce from 'lodash.debounce';

export function debounceAsync(fn, wait = 400) {
  // let promise = null;
  const debounced = debounce((resolve, ...args) => {
    promise = fn(...args).then(resolve);
  }, wait);

  return (...args) =>
    new Promise(resolve => {
      debounced(resolve, ...args);
    });
}
