import React from 'react';

interface ContainerContentProps {
  children?: React.ReactNode;
}

const ContainerContent: React.FC<ContainerContentProps> = ({ children }) => {
  return (
    <div className="content-wrapper">
      {children}
    </div>
  );
};

export default ContainerContent;
