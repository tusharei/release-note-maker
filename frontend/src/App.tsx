import { useState, useEffect } from 'react';
import HeaderForm from './components/HeaderForm';
import ReleaseDetailsForm from './components/ReleaseDetailsForm';
import FunctionalDescriptionForm from './components/FunctionalDescriptionForm';
import TechnicalDescriptionForm from './components/TechnicalDescriptionForm';
import ReleaseDetailsPart2Form from './components/ReleaseDetailsPart2Form';
import ImplementationPlanForm from './components/ImplementationPlanForm';
import ValidationForm from './components/ValidationForm';
import Toast from './components/Toast';
import { exportToWord } from './services/api';
import type { ReleaseNote } from './types';

const STORAGE_KEY = 'releaseNoteData';

const createEmptyReleaseNote = (): ReleaseNote => ({
  version: '',
  versionWithoutText: '',
  releaseDate: new Date().toISOString().split('T')[0],
  author: '',
  reviewer: '',
  clientName: '',
  impactedModule: '',
  releaseContains: '',
  md5sum: '',
  gitBranch: '',
  commitId: '',
  functionalDescription: '',
  technicalHeadline: '',
  technicalObjective: '',
  technicalImpactedApi: '',
  technicalConfigParams: '',
  technicalConfigChanges: '',
  technicalDBChanges: '',
  networkChanges: '',
  prerequisite: '',
  prodReleaseDetails: '',
  upiSwitchStop: '',
  upiBigStop: '',
  dbScriptDesc: '',
  upiBigDesc: '',
  upiSwitchDesc: '',
  upiBigStart: '',
  upiSwitchStart: '',
  otherServiceDesc: '',
  rollbackDb: '',
  rollbackSwitch: '',
  testerName: '',
  testValidatorName: '',
});

// Load from localStorage
const loadFromStorage = (): ReleaseNote | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }
  return null;
};

// Save to localStorage
const saveToStorage = (data: ReleaseNote) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

// Clear from localStorage
const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
};

function App() {
  const [releaseNote, setReleaseNote] = useState<ReleaseNote>(() => {
    const saved = loadFromStorage();
    return saved || createEmptyReleaseNote();
  });
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Save to localStorage whenever releaseNote changes
  useEffect(() => {
    saveToStorage(releaseNote);
  }, [releaseNote]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const updateField = <K extends keyof ReleaseNote>(field: K, value: ReleaseNote[K]) => {
    setReleaseNote(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = async () => {
    if (!releaseNote.version) {
      showToast('Please enter a version number', 'error');
      return;
    }
    if (!releaseNote.clientName) {
      showToast('Please enter a client name', 'error');
      return;
    }

    setIsExporting(true);
    try {
      console.log('Starting export to:', import.meta.env.VITE_API_URL || 'http://localhost:8080/api');
      const blob = await exportToWord(releaseNote);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ReleaseNote_${releaseNote.version}_${releaseNote.releaseDate}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Release note exported successfully!', 'success');
    } catch (error: any) {
      console.error('Export failed:', error);
      // Show more specific error message
      const errorMessage = error.response?.status === 404 
        ? 'API endpoint not found. Check VITE_API_URL in Netlify settings.'
        : error.response?.status === 403
        ? 'CORS error. Backend may not allow requests from this domain.'
        : error.response?.status === 500
        ? 'Backend server error. Check Render logs.'
        : 'Failed to export release note. Make sure the backend is running.';
      showToast(errorMessage, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all fields?')) {
      setReleaseNote(createEmptyReleaseNote());
      clearStorage();
      showToast('Form cleared', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-sarvatra-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/sarvatraLogo.jpeg" 
                alt="Sarvatra Logo" 
                className="h-20 w-auto bg-white p-1 rounded"
              />
              <div>
                <h1 className="text-3xl font-bold">Release Note Maker</h1>
                <p className="text-blue-100 mt-1">Sarvatra Technologies</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition"
              >
                Clear Form
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="btn-primary flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <span className="loading-spinner" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Word
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <HeaderForm releaseNote={releaseNote} updateField={updateField} />
          <ReleaseDetailsForm releaseNote={releaseNote} updateField={updateField} />
          <FunctionalDescriptionForm releaseNote={releaseNote} updateField={updateField} />
          <TechnicalDescriptionForm releaseNote={releaseNote} updateField={updateField} />
          <ReleaseDetailsPart2Form releaseNote={releaseNote} updateField={updateField} />
          <ImplementationPlanForm releaseNote={releaseNote} updateField={updateField} />
          <ValidationForm releaseNote={releaseNote} updateField={updateField} />
        </div>

        {/* Export Section */}
        <div className="section-card mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Ready to Export?</h2>
              <p className="text-sm text-gray-600 mt-1">
                Download your release note as a Word document (.docx)
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-primary text-lg px-8 py-3 flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <span className="loading-spinner" />
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Release Note
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Release Note Maker v1.0 | Sarvatra Technologies</p>

          <p className="text-sm mt-1">
            Made with ❤️ by Tushar Sharma, for Devs.
          </p>

          <p className="text-xs mt-2 text-gray-500">
            Note: This project runs on a freemium model. Please use AI rephrasing thoughtfully.
          </p>

          <div className="mt-3 flex justify-center items-center gap-2">
            <a
              href="https://github.com/tusharei/release-note-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            >
              {/* GitHub SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.2 11.4c.6.1.82-.26.82-.58v-2.02c-3.34.73-4.04-1.6-4.04-1.6-.54-1.36-1.32-1.72-1.32-1.72-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.06 1.82 2.78 1.3 3.46.99.1-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.9 1.23 3.22 0 4.6-2.81 5.61-5.49 5.91.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>

              <span>Contribute on GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
