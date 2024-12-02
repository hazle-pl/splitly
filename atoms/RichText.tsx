import React from 'react';

interface ContainerContentProps {
  children?: React.ReactNode;
  grid?: string;
}

const RichText: React.FC<ContainerContentProps> = ({ children, grid }) => {
  return (
    <div className={`richText ${grid}`}>
      {children}
    </div>
  );
};

export default RichText;
