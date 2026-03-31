import React from 'react';
import type { ReleaseNote } from '../types';

interface Props {
  releaseNote: ReleaseNote;
  updateField: <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => void;
}

const ReleaseDetailsForm: React.FC<Props> = ({ releaseNote, updateField }) => {

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    e.target.setSelectionRange(val.length, val.length);
  };

  return (
    <div className="section-card">
      <h2 className="section-title">1.1 Release Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Client Name */}
        <div>
          <label className="input-label">Client Name *</label>
          <textarea
            className="input-field h-20 resize-none"
            value={releaseNote.clientName}
            onFocus={handleFocus}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder={`eg. Pinelab PPI...`}
          />
        </div>

        {/* Impacted Module */}
        <div>
          <label className="input-label">Impacted Module</label>
          <textarea
            className="input-field h-24 resize-none"
            value={releaseNote.impactedModule}
            onFocus={handleFocus}
            onChange={(e) => updateField('impactedModule', e.target.value)}
            placeholder={`- UPI Switch...\n- BIG Module...\n- DB Changes...`}
          />
        </div>

        {/* Release Contains */}
        <div>
          <label className="input-label">Release Contains</label>
          <textarea
            className="input-field h-24 resize-none"
            value={releaseNote.releaseContains}
            onFocus={handleFocus}
            onChange={(e) => updateField('releaseContains', e.target.value)}
            placeholder={`- Switch...\n- BIG...\n- DB...`}
          />
        </div>

        {/* MD5Sum */}
        <div>
          <label className="input-label">MD5Sum</label>
          <textarea
            className="input-field h-20 resize-none"
            value={releaseNote.md5sum}
            onFocus={handleFocus}
            onChange={(e) => updateField('md5sum', e.target.value)}
            placeholder={`jar md5sum...`}
          />
        </div>

        {/* Git Branch */}
        <div>
          <label className="input-label">Git Branch</label>
          <textarea
            className="input-field h-20 resize-none"
            value={releaseNote.gitBranch}
            onFocus={handleFocus}
            onChange={(e) => updateField('gitBranch', e.target.value)}
            placeholder={`feature/upi-bank...\norigin/upi-kernel...`}
          />
        </div>

        {/* Commit ID */}
        <div>
          <label className="input-label">Commit ID</label>
          <textarea
            className="input-field h-20 resize-none"
            value={releaseNote.commitId}
            onFocus={handleFocus}
            onChange={(e) => updateField('commitId', e.target.value)}
            placeholder={`release commit id...`}
          />
        </div>

      </div>
    </div>
  );
};

export default ReleaseDetailsForm;