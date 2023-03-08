import { useCallback, useEffect, useRef, useState } from 'react';
import { createContainer } from 'unstated-next';
import { useSelectionManager } from './selection';

const { useContainer: useView, Provider: ViewProvider } = createContainer(
  () => {
    const [viewStatus, setViewStatus] = useState<
      'icon' | 'input' | 'result' | 'none'
    >('none');
    const viewStatusRef = useRef<string>();
    viewStatusRef.current = viewStatus;
    const selection = useSelectionManager();

    const goToInputPage = useCallback(() => {
      if (viewStatusRef.current !== 'icon') {
        setTimeout(() => document.addEventListener('click', hide), 1000);
      }
      setViewStatus('input');
      selection.setLock(true);
    }, []);

    const goToResult = useCallback(() => {
      setViewStatus('result');
      document.removeEventListener('click', hide);
    }, []);

    const goToIcon = useCallback(() => {
      selection.setLock(true);
      setViewStatus('icon');
      setTimeout(() => document.addEventListener('click', hide), 1000);
    }, []);

    const hide = useCallback(() => {
      setViewStatus('none');
      selection.setLock(false);
    }, []);

    useEffect(() => {
      selection.onSelectionChange((s) => {
        if (s.toString()) {
          goToIcon();
        }

        setTimeout(() => {
          if (viewStatusRef.current === 'icon') {
            hide();
          }
        }, 3000);
      });

      return () => document.removeEventListener('click', hide);
    }, []);

    return {
      viewStatus,
      goToInputPage,
      goToResult,
      goToIcon,
      hide,
    };
  }
);

export { useView, ViewProvider };
