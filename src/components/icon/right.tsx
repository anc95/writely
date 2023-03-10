export const RightArrowIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 30 30"
      className="chevronRight"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        fill: 'rgba(55, 53, 47, 0.45)',
        flexShrink: 0,
        backfaceVisibility: 'hidden',
        // transform: 'rotate(-90deg)',
      }}
    >
      <polygon points="17.4,15 7,25.2 9.8,28 23,15 9.8,2 7,4.8"></polygon>
    </svg>
  );
};
