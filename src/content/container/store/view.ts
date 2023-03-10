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
    const disposeListRef = useRef<(() => void)[]>([]);

    const disposeAll = useCallback(() => {
      disposeListRef.current.forEach((c) => c());
      disposeListRef.current = [];
    }, []);

    const goToInputPage = useCallback(() => {
      if (viewStatusRef.current !== 'icon') {
        document.addEventListener('click', hide);
        disposeListRef.current.push(() => {
          document.removeEventListener('click', hide);
        });
      }
      setViewStatus('input');
      selection.setLock(true);
    }, []);

    const goToResult = useCallback(() => {
      setViewStatus('result');
      disposeAll();
    }, []);

    const goToIcon = useCallback(() => {
      selection.setLock(true);
      setViewStatus('icon');
      document.addEventListener('click', hide);
      disposeListRef.current.push(() => {
        document.removeEventListener('click', hide);
      });
    }, []);

    const hide = useCallback(() => {
      setViewStatus('none');
      selection.setLock(false);
      disposeAll();
    }, []);

    useEffect(() => {
      let id = null;

      selection.onSelectionChange((s) => {
        if (s.toString() && viewStatusRef.current === 'none') {
          goToIcon();

          clearTimeout(id);
          id = setTimeout(() => {
            if (viewStatusRef.current === 'icon') {
              hide();
            }
          }, 3000);
        }
      });

      return () => {
        disposeAll();
        clearTimeout(id);
      };
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
