export const BaseTemplate = (props: {
  children: React.ReactNode;
  maxWidth?: string;
}) => {
  const maxWidthClass = props.maxWidth ?? 'max-w-screen-md';

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      <div className={`mx-auto ${maxWidthClass}`}>
        <main>{props.children}</main>
      </div>
    </div>
  );
};
