import { useState } from 'react';
import { useUpdateEffect } from 'ahooks';

const useReload = (
  initialLoading: boolean,
  callback?: () => void,
): [boolean, () => void] => {
  const [loading, setLoading] = useState(initialLoading);
  const reload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };
  useUpdateEffect(() => {
    // 加载完成后执行回调函数
    if (!loading) {
      if (callback) {
        callback();
      }
    }
  }, [loading]);
  return [loading, reload];
};

export default useReload;
