import { ResultPanelProvider } from '../../store/result-panel';
import { Content } from './content';
import { Header } from './header';

export const ResultPanel: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <ResultPanelProvider>
      <div className="overflow-hidden rounded-lg shadow-xl w-[500px]">
        <div className="border-zinc-200 rounded-lg">
          <Header />
        </div>
        <Content text={text} />
      </div>
    </ResultPanelProvider>
  );
};
