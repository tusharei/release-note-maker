import React from 'react';
import type { ReleaseNote } from '../types';
import RichTextEditor from './RichTextEditor';
import BeautifyButton from './BeautifyButton';

interface Props {
  releaseNote: ReleaseNote;
  updateField: <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => void;
}

const TechnicalDescriptionForm: React.FC<Props> = ({ releaseNote, updateField }) => {
  return (
    <div className="section-card">
      <h2 className="section-title">1.2 Project Description - Technical</h2>
      
      {/* Technical Headline */}
      <div className="mb-4">
        <label className="input-label font-semibold">Technical Headline</label>
        <input
          type="text"
          className="input-field"
          value={releaseNote.technicalHeadline ?? ''}
          onChange={(e) => updateField('technicalHeadline', e.target.value)}
          placeholder="Enter technical headline..."
        />
      </div>

      {/* Objective */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <label className="input-label font-semibold">Objective</label>
          <BeautifyButton
            onBeautify={(beautified) => updateField('technicalObjective', beautified)}
            content={releaseNote.technicalObjective ?? ''}
            style="technical"
          />
        </div>

        <RichTextEditor
          key="technicalObjective"
          value={releaseNote.technicalObjective ?? ''}
          onChange={(value) => updateField('technicalObjective', value)}
          placeholder="    Enter objective..."
          height="120px"
        />
      </div>

      {/* Impacted API's */}
      <div className="mb-16">
        <label className="input-label font-semibold">Impacted API's</label>

        <RichTextEditor
          key="technicalImpactedApi"
          value={releaseNote.technicalImpactedApi ?? ''}
          onChange={(value) => updateField('technicalImpactedApi', value)}
          placeholder="    Enter impacted API's..."
          height="120px"
        />
      </div>

      {/* Configurable Parameters */}
      <div className="mb-16">
        <label className="input-label font-semibold">Configurable Parameters</label>

        <RichTextEditor
          key="technicalConfigParams"
          value={releaseNote.technicalConfigParams ?? ''}
          onChange={(value) => updateField('technicalConfigParams', value)}
          placeholder="    Enter configurable parameters..."
          height="120px"
        />
      </div>

      {/* Configuration Changes */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <label className="input-label font-semibold">Configuration Changes</label>
          <BeautifyButton
            onBeautify={(beautified) => updateField('technicalConfigChanges', beautified)}
            content={releaseNote.technicalConfigChanges ?? ''}
            style="technical"
          />
        </div>

        <RichTextEditor
          key="technicalConfigChanges"
          value={releaseNote.technicalConfigChanges ?? ''}
          onChange={(value) => updateField('technicalConfigChanges', value)}
          placeholder="    Enter configuration changes..."
          height="120px"
        />
      </div>

      {/* Database Changes */}
      <div className="mb-16">
        <label className="input-label font-semibold">Database Changes</label>

        <RichTextEditor
          key="technicalDBChanges"
          value={releaseNote.technicalDBChanges ?? ''}
          onChange={(value) => updateField('technicalDBChanges', value)}
          placeholder="    Enter database changes..."
          height="120px"
        />
      </div>
    </div>
  );
};

export default TechnicalDescriptionForm;