export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isLowEndDevice = () => {
  if (!navigator.deviceMemory) return false;
  return navigator.deviceMemory < 4;
};

export const getOptimalAnimationConfig = () => {
  const isMobile = isMobileDevice();
  const isLowEnd = isLowEndDevice();

  return {
    useRAF: true,
    maxFPS: isMobile ? (isLowEnd ? 30 : 60) : 60,
    reduceBlur: isMobile,
    simplifyEffects: isLowEnd,
    frameSkip: isLowEnd ? 2 : 1
  };
};

export const requestIdleCallback = (callback) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback);
  }
  return setTimeout(callback, 1);
};

export const cancelIdleCallback = (id) => {
  if ('cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }
  return clearTimeout(id);
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const reducedMotionPreferred = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const enableHardwareAcceleration = (element) => {
  if (element) {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  }
};

export const disableHardwareAcceleration = (element) => {
  if (element) {
    element.style.transform = '';
    element.style.willChange = '';
  }
};
