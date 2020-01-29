const _getARandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const _unique = arr => arr.filter((item, i, ar) => ar.indexOf(item) === i);

const _slice = (array, start, end) => {
  let length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  start = start == null ? 0 : start;
  end = end === undefined ? length : end;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : (end - start) >>> 0;
  start >>>= 0;

  let index = -1;
  const result = new Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
};

const _sampleSize = (array, n) => {
  n = n == null ? 1 : n;
  const length = array == null ? 0 : array.length;
  if (!length || n < 1) {
    return [];
  }
  n = n > length ? length : n;
  let index = -1;
  const lastIndex = length - 1;
  const result = [...array];
  while (++index < n) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return _slice(result, 0, n);
};

const _getRandEleFromArray = (my_arr, sample_size) =>
  _sampleSize(_unique(my_arr.map(({ id }) => id)), sample_size);

module.exports = {
  _getARandomNumber,
  _unique,
  _slice,
  _sampleSize,
  _getRandEleFromArray,
};
