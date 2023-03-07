import { Tooltip } from 'antd';
import { MdiClose, RiArrowGoBackFill } from '@/components/icon';
import { ReactNode } from 'react';

export const Header: React.FC = () => {
  return (
    <div className="flex px-2 items-center bg-zinc-900 cursor-move">
      <Operation icon={<RiArrowGoBackFill />} tootip="Back" />
      <Operation icon={<MdiClose />} tootip="Close window" />
    </div>
  );
};

const Operation: React.FC<{
  icon: ReactNode;
  tootip: string;
}> = ({ icon, tootip }) => {
  return (
    <Tooltip title={tootip}>
      <div className="text-white p-3 flex items-center justify-center cursor-pointer hover:bg-zinc-800">
        {icon}
      </div>
    </Tooltip>
  );
};