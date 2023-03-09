import { PropsWithChildren } from 'react';

export const Block: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="border-b border-gray-200">{children}</div>;
};
