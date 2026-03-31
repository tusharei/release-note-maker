import React from 'react';
import type { ReleaseNote } from '../types';
import RichTextEditor from './RichTextEditor';
import BeautifyButton from './BeautifyButton';

interface Props {
  releaseNote: ReleaseNote;
  updateField: <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => void;
}
const formatTextToHtml = (text: string) => {
  if (!text) return '';

  return text
    .split('\n')
    .map(line => {
      const trimmed = line.trim();

      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return `<li>${trimmed.replace(/^[-•]\s*/, '')}</li>`;
      }

      if (trimmed === '') {
        return '<br/>';
      }

      return `<p>${trimmed}</p>`;
    })
    .join('');
};

const FunctionalDescriptionForm: React.FC<Props> = ({ releaseNote, updateField }) => {
  return (
    <div className="section-card">
      <h2 className="section-title">1.1 Project Description - Functional</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter the functional description of all fixes and changes included in this release
      </p>
      
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <label className="input-label font-semibold">Functional Description</label>
          <BeautifyButton
            onBeautify={(beautified) => {
            const formatted = formatTextToHtml(beautified);
            updateField('functionalDescription', formatted);
          }}
            content={releaseNote.functionalDescription || ''}
            style="functional"
          />
        </div>

        <RichTextEditor
          value={releaseNote.functionalDescription || ''}
          onChange={(value) => updateField('functionalDescription', value)}
          placeholder="    Enter functional description..."
          height="150px"
        />
      </div>
    </div>
  );
};

export default FunctionalDescriptionForm;
