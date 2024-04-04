// 'use server'

import React from 'react';

interface ActionProps {
  handleClick: () => void;
  type: string;
  className: string;
  'data-testid'?: string; // Make data-testid optional
 }
 
 const Action: React.FC<ActionProps> = ({ handleClick, type, className, 'data-testid': testId }) => {
  return (
     <div className={className} onClick={handleClick} data-testid={testId}>
       {type}
     </div>
  );
 };
 
 export default Action;
