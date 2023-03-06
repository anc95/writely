import { Content } from './content';
import { Header } from './header';

export const ResultPanel: React.FC<{
  loading: boolean;
  content: string;
}> = ({ loading, content }) => {
  return (
    <div>
      <div className="border-b border-zinc-200 rounded-t-md">
        <Header />
      </div>
      <Content loading={loading} content={content} />
    </div>
  );
};
