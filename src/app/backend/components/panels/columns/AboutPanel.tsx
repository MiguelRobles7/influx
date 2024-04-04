// 'use server'

import React from 'react';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';

const AboutPanel: React.FC = () => {
  return (
    <Panel classes="right-footer">
      <span className="hover:underline">About</span>
      <span>•</span>
      <span className="hover:underline">Terms</span>
      <span>•</span>
      <span className="hover:underline">Documentation</span>
      <span>•</span>
      <span className="hover:underline">Legal</span>
      influx.io © 2023. Made with Next.js.
    </Panel>
  );
};

export default AboutPanel;
