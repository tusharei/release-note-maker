import React, { useEffect, useState } from 'react';
import type { ReleaseNote } from '../types';

interface Props {
  releaseNote: ReleaseNote;
  updateField: <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => void;
}

const DEFAULT_TEXT = "NA";
const NETWORK_DEFAULT_TEXT = "NA";
const PREREQUISITE_DEFAULT_TEXT = `1. Java 11 to be installed on existing switch server.
2. Java 8 to be installed on existing BIG server.`;

const PRODRELEASE_DEFAULT_TEXT = `1. SFTP Snapshot – Existing
2. SFTP Snapshot – Post deployment
3. DB script details – NA`;

const ReleaseDetailsPart2Form: React.FC<Props> = ({ releaseNote, updateField }) => {
  const [isDefaultNetwork, setIsDefaultNetwork] = useState(true);
  const [isDefaultPrereq, setIsDefaultPrereq] = useState(true);
  const [isDefaultProd, setIsDefaultProd] = useState(true);

  useEffect(() => {
    // Network Changes
    if (!releaseNote.networkChanges || releaseNote.networkChanges.trim() === '') {
      updateField('networkChanges', NETWORK_DEFAULT_TEXT);
      setIsDefaultNetwork(true);
    } else {
      setIsDefaultNetwork(releaseNote.networkChanges === DEFAULT_TEXT);
    }

    // Prerequisite
    if (!releaseNote.prerequisite || releaseNote.prerequisite.trim() === '') {
      updateField('prerequisite', PREREQUISITE_DEFAULT_TEXT);
      setIsDefaultPrereq(true);
    } else {
      setIsDefaultPrereq(releaseNote.prerequisite === DEFAULT_TEXT);
    }

    // Prod Release Details
    if (!releaseNote.prodReleaseDetails || releaseNote.prodReleaseDetails.trim() === '') {
      updateField('prodReleaseDetails', PRODRELEASE_DEFAULT_TEXT);
      setIsDefaultProd(true);
    } else {
      setIsDefaultProd(releaseNote.prodReleaseDetails === DEFAULT_TEXT);
    }
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    e.target.setSelectionRange(val.length, val.length);
  };

  return (
    <div className="section-card">
      <h2 className="section-title">1.4 Prod Release patch details/snapshot</h2>

      {/* 1.4.1 Network Changes */}
      <div className="mb-6">
        <label className="input-label font-semibold">1.4.1 Network Changes</label>
        <textarea
          className={`input-field h-24 resize-none ${
            isDefaultNetwork ? 'text-gray-400' : 'text-gray-900'
          }`}
          value={releaseNote.networkChanges}
          onFocus={handleFocus}
          onChange={(e) => {
            const value = e.target.value;
            if (isDefaultNetwork && value !== DEFAULT_TEXT) {
              setIsDefaultNetwork(false);
            }
            updateField('networkChanges', value);
          }}
        />
      </div>

      {/* 1.4.2 Pre-requisite */}
      <div className="mb-6">
        <label className="input-label font-semibold">1.4.2 Pre-requisite</label>
        <textarea
          className={`input-field h-24 resize-none ${
            isDefaultPrereq ? 'text-gray-400' : 'text-gray-900'
          }`}
          value={releaseNote.prerequisite}
          onFocus={handleFocus}
          onChange={(e) => {
            const value = e.target.value;
            if (isDefaultPrereq && value !== DEFAULT_TEXT) {
              setIsDefaultPrereq(false);
            }
            updateField('prerequisite', value);
          }}
        />
      </div>

      {/* 1.5 Prod Release details/snapshot */}
      <div>
        <label className="input-label font-semibold">1.5 Prod Release details/snapshot</label>
        <textarea
          className={`input-field h-24 resize-none ${
            isDefaultProd ? 'text-gray-400' : 'text-gray-900'
          }`}
          value={releaseNote.prodReleaseDetails}
          onFocus={handleFocus}
          onChange={(e) => {
            const value = e.target.value;
            if (isDefaultProd && value !== DEFAULT_TEXT) {
              setIsDefaultProd(false);
            }
            updateField('prodReleaseDetails', value);
          }}
        />
      </div>
    </div>
  );
};

export default ReleaseDetailsPart2Form;