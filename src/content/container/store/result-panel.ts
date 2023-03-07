import { useState } from 'react';
import { createContainer } from 'unstated-next';

const { useContainer: useResultPanel, Provider: ResultPanelProvider } =
  createContainer(() => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    return {
      loading,
      setLoading,
      result,
      setResult,
    };
  });

export { useResultPanel, ResultPanelProvider };
