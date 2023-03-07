import { Tooltip } from 'antd';
import { MdiClose, RiArrowGoBackFill } from '@/components/icon';
import { ReactNode } from 'react';
import { useView } from '../../store/view';

export const Header: React.FC = () => {
  const { hide, goToInputPage } = useView();

  return (
    <div className="flex px-2 items-center bg-zinc-900 cursor-move handle">
      <Operation
        icon={<RiArrowGoBackFill />}
        tootip="Back"
        onClick={goToInputPage}
      />
      <Operation icon={<MdiClose />} tootip="Close window" onClick={hide} />
    </div>
  );
};

const Operation: React.FC<{
  icon: ReactNode;
  tootip: string;
  onClick: () => void;
}> = ({ icon, tootip, onClick }) => {
  return (
    <Tooltip title={tootip}>
      <div
        onClick={onClick}
        className="text-white p-3 flex items-center justify-center cursor-pointer hover:bg-zinc-800"
      >
        {icon}
      </div>
    </Tooltip>
  );
};
