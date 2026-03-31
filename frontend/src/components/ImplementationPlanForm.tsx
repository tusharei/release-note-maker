import React, { useEffect, useState } from 'react';
import type { ReleaseNote } from '../types';
import BeautifyButton from './BeautifyButton';

interface Props {
  releaseNote: ReleaseNote;
  updateField: <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => void;
}

// Defaults
const DEFAULT_SWITCH_STOP = "Stop existing UPI Switch - ./bin/stop";
const DEFAULT_BIG_STOP = "Stop existing UPI BIG - ./bin/stop";
const DEFAULT_BIG_START = "Start UPI BIG - ./bin/start";
const DEFAULT_SWITCH_START = "Start UPI SWITCH - ./bin/start";
const DEFAULT_ROLLBACK_DB = "NA";

const DEFAULT_ROLLBACK_SWITCH = `Following Steps to be performed.
1 - Stop the incoming traffic from NPCI .
2 - Allow in-flight transactions to finish.
3 - Post all transactions completed, stop complete traffic from LB.
4 - Stop the UPI Switch.
5 - Backup existing UPI Switch.
6 - Secure all the logs from new UPI Switch.
7 - Deploy old UPI Switch as taken before. 
8 - Enable NPCI traffic on the old deployed UPI Switch 
9 - Monitor all the transactions`;

const ImplementationPlanForm: React.FC<Props> = ({ releaseNote, updateField }) => {

  const [defaults, setDefaults] = useState({
    switchStop: true,
    bigStop: true,
    db: true,
    bigStart: true,
    switchStart: true,
    rollbackDb: true,
    rollbackSwitch: true
  });

  useEffect(() => {
    if (!releaseNote.upiSwitchStop) updateField('upiSwitchStop', DEFAULT_SWITCH_STOP);
    if (!releaseNote.upiBigStop) updateField('upiBigStop', DEFAULT_BIG_STOP);
    if (!releaseNote.upiBigStart) updateField('upiBigStart', DEFAULT_BIG_START);
    if (!releaseNote.upiSwitchStart) updateField('upiSwitchStart', DEFAULT_SWITCH_START);
    if (!releaseNote.rollbackDb) updateField('rollbackDb', DEFAULT_ROLLBACK_DB);
    if (!releaseNote.rollbackSwitch) updateField('rollbackSwitch', DEFAULT_ROLLBACK_SWITCH);
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    e.target.setSelectionRange(val.length, val.length);
  };

  const handleChange = (field: keyof typeof defaults, value: string, key: keyof ReleaseNote) => {
    setDefaults(prev => ({ ...prev, [field]: false }));
    updateField(key, value);
  };

  return (
    <div className="section-card">
      <h2 className="section-title">1.6 Implementation Plan</h2>

      {/* PRIOR */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Prior to Production Deployment</h3>

        <div className="grid gap-3">

          {/* 1.00 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1">1.00</div>
            <div className="col-span-2 font-medium">UPI SWITCH (stop)</div>
            <div className="col-span-9">
              <input
                className={`input-field ${defaults.switchStop ? 'text-gray-400' : 'text-black'}`}
                value={releaseNote.upiSwitchStop}
                onFocus={handleFocus}
                onChange={(e) => handleChange('switchStop', e.target.value, 'upiSwitchStop')}
              />
            </div>
          </div>

          {/* 2.00 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1">2.00</div>
            <div className="col-span-2 font-medium">UPI BIG (stop)</div>
            <div className="col-span-9">
              <input
                className={`input-field ${defaults.bigStop ? 'text-gray-400' : 'text-black'}`}
                value={releaseNote.upiBigStop}
                onFocus={handleFocus}
                onChange={(e) => handleChange('bigStop', e.target.value, 'upiBigStop')}
              />
            </div>
          </div>

        </div>
      </div>

      {/* DEPLOYMENT */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Production Deployment</h3>

        <div className="grid gap-3">

          {/* 3.00 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1">3.00</div>
            <div className="col-span-2 font-medium">DB</div>
            <div className="col-span-9">
              <textarea
                className="input-field h-16"
                placeholder="Enter DB deployment steps..."
                value={releaseNote.dbScriptDesc}
                onChange={(e) => updateField('dbScriptDesc', e.target.value)}
              />
            </div>
          </div>

          {/* 4.00 */}
          <div className="grid grid-cols-12 gap-2 items-start">
            <div className="col-span-1">4.00</div>

            <div className="col-span-2 font-medium">
              UPI BIG (Description)
            </div>

            <div className="col-span-9">
              <div className="flex items-center gap-2 mb-1">
                <BeautifyButton
                  onBeautify={(beautified) => updateField('upiBigDesc', beautified)}
                  content={releaseNote.upiBigDesc}
                  style="functional"
                />
              </div>

              <textarea
                className="input-field h-16 w-full"
                placeholder="Enter UPI BIG deployment steps..."
                value={releaseNote.upiBigDesc}
                onChange={(e) => updateField('upiBigDesc', e.target.value)}
              />
            </div>
          </div>

          {/* 5.00 */}
          <div className="grid grid-cols-12 gap-2 items-start">
            <div className="col-span-1">5.00</div>

            <div className="col-span-2 font-medium">
              UPI Switch (Description)
            </div>

            <div className="col-span-9">
              <div className="flex items-center gap-2 mb-1">
                <BeautifyButton
                  onBeautify={(beautified) => updateField('upiSwitchDesc', beautified)}
                  content={releaseNote.upiSwitchDesc}
                  style="functional"
                />
              </div>

              <textarea
                className="input-field h-16 w-full"
                placeholder="Enter UPI Switch deployment steps..."
                value={releaseNote.upiSwitchDesc}
                onChange={(e) => updateField('upiSwitchDesc', e.target.value)}
              />
            </div>
          </div>

          {/* 6.00 - Other Services */}
          <div className="grid grid-cols-12 gap-2 items-start">
            <div className="col-span-1">6.00</div>
            <div className="col-span-2 font-medium">Other Services<br/>(eg. App GW/ Rule Engine, etc)</div>
            <div className="col-span-9">
              <textarea
                className="input-field h-20"
                placeholder="Enter other services deployment steps..."
                value={releaseNote.otherServiceDesc || ''}
                onChange={(e) => updateField('otherServiceDesc', e.target.value)}
              />
            </div>
          </div>

          {/* 7.00 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1">7.00</div>
            <div className="col-span-2 font-medium">UPI BIG</div>
            <div className="col-span-9">
              <input
                className={`input-field ${defaults.bigStart ? 'text-gray-400' : 'text-black'}`}
                value={releaseNote.upiBigStart}
                onFocus={handleFocus}
                onChange={(e) => handleChange('bigStart', e.target.value, 'upiBigStart')}
              />
            </div>
          </div>

          {/* 8.00 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1">8.00</div>
            <div className="col-span-2 font-medium">UPI SWITCH</div>
            <div className="col-span-9">
              <input
                className={`input-field ${defaults.switchStart ? 'text-gray-400' : 'text-black'}`}
                value={releaseNote.upiSwitchStart}
                onFocus={handleFocus}
                onChange={(e) => handleChange('switchStart', e.target.value, 'upiSwitchStart')}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ROLLBACK */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Rollback</h3>

        <div className="grid gap-3">

          {/* 1.00 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1">1.00</div>
            <div className="col-span-2 font-medium">DB</div>
            <div className="col-span-9">
              <input
                className={`input-field ${defaults.rollbackDb ? 'text-gray-400' : 'text-black'}`}
                value={releaseNote.rollbackDb}
                onFocus={handleFocus}
                onChange={(e) => handleChange('rollbackDb', e.target.value, 'rollbackDb')}
              />
            </div>
          </div>

          {/* 2.00 */}
          <div className="grid grid-cols-12 gap-2 items-start">
            <div className="col-span-1">2.00</div>
            <div className="col-span-2 font-medium">UPI SWITCH</div>
            <div className="col-span-9">
              <textarea
                className={`input-field h-40 ${defaults.rollbackSwitch ? 'text-gray-400' : 'text-black'}`}
                value={releaseNote.rollbackSwitch}
                onFocus={handleFocus}
                onChange={(e) => handleChange('rollbackSwitch', e.target.value, 'rollbackSwitch')}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImplementationPlanForm;