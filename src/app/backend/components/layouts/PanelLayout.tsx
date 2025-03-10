// 'use server'

import React from 'react';
import { MoveUpRight } from 'lucide-react';

interface Props {
  title?: string;
  expand?: boolean;
  classes?: string;
  children?: React.ReactNode;
}

const PanelLayout: React.FC<Props> = ({ title, expand, children, classes }) => {
  return (
    <aside className={`${classes} base-panel`}>
      {title || expand ? (
        <div className="flex flex-row justify-between items-center">
          {title && <h6 className=" font-normal text-xs">{title}</h6>}
          {expand && <MoveUpRight color="black" size={12} />}
        </div>
      ) : null}
      {children}
    </aside>
  );
};

export default PanelLayout;
