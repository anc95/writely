import { Button, Spin } from 'antd';

export const ResultPanel: React.FC<{ loading: boolean; content: string }> = ({
  loading,
  content,
}) => {
  return (
    <div className="shadow-2xl rounded-lg bg-white max-w-lg">
      <Spin spinning={loading}>
        <div className="p-4">{content}</div>
        <div className="border-t border-gray-200 px-4 py-2 flex gap-3">
          <Button>Copy</Button>
          <Button>Replay</Button>
          <Button>Insert</Button>
        </div>
      </Spin>
    </div>
  );
};
