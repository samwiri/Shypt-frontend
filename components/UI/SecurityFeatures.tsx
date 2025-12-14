import React from 'react';
import { QrCode } from 'lucide-react';

interface SecurityFeaturesProps {
  type: 'COPY' | 'ORIGINAL' | 'DRAFT' | 'CONFIDENTIAL';
  reference: string;
  user?: string;
  date?: string;
}

export const Watermark: React.FC<{ text: string }> = ({ text }) => (
  <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.05] overflow-hidden">
    <div className="transform -rotate-45 text-slate-900 font-black text-[150px] whitespace-nowrap select-none">
      {text}
    </div>
  </div>
);

export const SecurityFooter: React.FC<SecurityFeaturesProps> = ({ reference, user = 'System User', date }) => (
  <div className="mt-8 border-t-2 border-slate-100 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-mono print:flex">
    <div className="flex items-center gap-4">
      <div className="p-1 bg-white border border-slate-200">
        <QrCode size={32} className="text-slate-800" />
      </div>
      <div>
        <p>Doc Ref: {reference}</p>
        <p>Generated: {date || new Date().toLocaleString()}</p>
        <p>By: {user}</p>
      </div>
    </div>
    <div className="text-right mt-2 md:mt-0">
      <p>SHYPT SECURE DOCUMENT</p>
      <p>Any alteration invalidates this record.</p>
      <p>www.shypt.net</p>
    </div>
  </div>
);

export const SecureHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="hidden print:flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider">{title}</h1>
      <p className="text-xs text-slate-500">Shypt Logistics • www.shypt.net</p>
    </div>
    <div className="text-right">
      <p className="text-xl font-black text-slate-200">OFFICIAL</p>
    </div>
  </div>
);