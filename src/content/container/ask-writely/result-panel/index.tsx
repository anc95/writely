import { Content } from './content';
import { Header } from './header';

export const ResultPanel: React.FC<{
  loading: boolean;
  content: string;
}> = ({ loading, content }) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-xl min-w-[600px] max-w-4xl">
      <div className="border-zinc-200 rounded-lg">
        <Header />
      </div>
      <Content loading={loading} content={content} />
    </div>
  );
};
