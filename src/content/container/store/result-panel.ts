import { useState } from 'react';
import { createContainer } from 'unstated-next';

const { useContainer: useResultPanel, Provider: ResultPanelProvider } =
  createContainer(() => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [text, setText] = useState('');

    return {
      loading,
      setLoading,
      result,
      setResult,
      text,
      setText,
    };
  });

export { useResultPanel, ResultPanelProvider };
