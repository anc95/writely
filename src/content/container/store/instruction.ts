import { useState } from 'react';
import { createContainer } from 'unstated-next';

export const { useContainer: useInstruction, Provider: InstructionProvider } =
  createContainer(() => {
    const [instruction, setInstruction] = useState<string>('');

    return {
      instruction,
      setInstruction,
    };
  });
