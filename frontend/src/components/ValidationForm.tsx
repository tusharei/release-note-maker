import React from 'react';
import type { ReleaseNote } from '../types';

interface Props {
  releaseNote: ReleaseNote;
  updateField: <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => void;
}

const ValidationForm: React.FC<Props> = ({ releaseNote, updateField }) => {
  return (
    <div className="section-card">
      <h2 className="section-title">1.6 Validation Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="input-label">Tester Name</label>
          <input
            type="text"
            className="input-field"
            value={releaseNote.testerName}
            onChange={(e) => updateField('testerName', e.target.value)}
            placeholder="QA Tester Name"
          />
        </div>
        <div>
          <label className="input-label">Test Validator Name</label>
          <input
            type="text"
            className="input-field"
            value={releaseNote.testValidatorName}
            onChange={(e) => updateField('testValidatorName', e.target.value)}
            placeholder="Test Validator Name"
          />
        </div>
      </div>
    </div>
  );
};

export default ValidationForm;
