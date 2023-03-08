import { Tooltip } from 'antd';
import {
  MdiClose,
  MaterialSymbolsKeyboardBackspace,
  DashiconsAdminGeneric,
  RiHeartFill,
} from '@/components/icon';
import { ReactNode } from 'react';
import { useView } from '../../store/view';
import i18next from 'i18next';

export const Header: React.FC = () => {
  const { hide, goToInputPage } = useView();

  return (
    <div className="flex px-2 items-center bg-zinc-900 cursor-move handle justify-between">
      <div className="flex items-center">
        <Operation
          icon={<MaterialSymbolsKeyboardBackspace />}
          tootip="Back"
          onClick={goToInputPage}
        />
        <Operation icon={<MdiClose />} tootip="Close window" onClick={hide} />
      </div>
      <div className="flex items-center">
        <Operation
          icon={
            <a href="https://github.com/anc95/writely" target="_blank">
              <RiHeartFill className="text-orange-600" />
            </a>
          }
          tootip={i18next.t('Love')}
        />
        <Operation
          icon={
            <a href={chrome.runtime.getURL('dist/options/index.html')}>
              <DashiconsAdminGeneric />
            </a>
          }
          tootip="Jump to settings"
        />
      </div>
    </div>
  );
};

const Operation: React.FC<{
  icon: ReactNode;
  tootip: string;
  onClick?: () => void;
}> = ({ icon, tootip, onClick }) => {
  return (
    <Tooltip title={tootip}>
      <div
        onClick={() => onClick?.()}
        className="text-white p-3 flex items-center justify-center cursor-pointer hover:bg-zinc-800"
      >
        {icon}
      </div>
    </Tooltip>
  );
};
