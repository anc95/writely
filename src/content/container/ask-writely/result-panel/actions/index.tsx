import { PropsWithChildren } from 'react';

export const Actions: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex items-center justify-center gap-6">{children}</div>
  );
};
