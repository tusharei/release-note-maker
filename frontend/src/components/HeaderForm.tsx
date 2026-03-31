import React from 'react';
import type { ReleaseNote } from '../types';

interface Props {
  releaseNote: ReleaseNote;
  updateField: <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => void;
}

const HeaderForm: React.FC<Props> = ({ releaseNote, updateField }) => {
  return (
    <div className="section-card">
      <h2 className="section-title">Document Header</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="input-label">Version * (Full)</label>
          <input
            type="text"
            className="input-field"
            value={releaseNote.version}
            onChange={(e) => updateField('version', e.target.value)}
            placeholder="e.g., PPIUPISWK_2.1.1"
          />
        </div>
        <div>
          <label className="input-label">Version (Number Only)</label>
          <input
            type="text"
            className="input-field"
            value={releaseNote.versionWithoutText}
            onChange={(e) => updateField('versionWithoutText', e.target.value)}
            placeholder="e.g., 2.1.1"
          />
        </div>
        <div>
          <label className="input-label">Release Date</label>
          <input
            type="date"
            className="input-field"
            value={releaseNote.releaseDate}
            onChange={(e) => updateField('releaseDate', e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">Author</label>
          <input
            type="text"
            className="input-field"
            value={releaseNote.author}
            onChange={(e) => updateField('author', e.target.value)}
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="input-label">Reviewer</label>
          <input
            type="text"
            className="input-field"
            value={releaseNote.reviewer}
            onChange={(e) => updateField('reviewer', e.target.value)}
            placeholder="Reviewer name"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderForm;
