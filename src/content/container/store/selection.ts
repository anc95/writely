import { useMemo } from 'react';
import { createContainer } from 'unstated-next';
import { SelectionManager } from '../../utils/selection';

const {
  useContainer: useSelectionManager,
  Provider: SelectionManagerProvider,
} = createContainer(() => {
  return useMemo(() => {
    return new SelectionManager();
  }, []);
});

export { useSelectionManager, SelectionManagerProvider };
