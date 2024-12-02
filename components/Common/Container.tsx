import React from 'react';
import ContentWrapper from './ContentWrapper';

interface ContainerProps {
  children: React.ReactNode;
  paddingBottom?: string;
  paddingTop?: string;
  background?: string;
  anchor?: string;
}

const Container: React.FC<ContainerProps> = ({ children, paddingBottom, paddingTop, background, anchor }) => {
  const classes = [
    paddingBottom ? `pb-${paddingBottom}` : '',
    paddingTop ? `pt-${paddingTop}` : '',
    background ? `bg-${background}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id={anchor} className={classes}>
        <ContentWrapper>
            {children}
        </ContentWrapper>
    </div>
  );
};

export default Container;
