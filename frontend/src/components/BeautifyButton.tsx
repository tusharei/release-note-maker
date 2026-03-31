import React, { useState } from 'react';
import { beautifyText } from '../services/api';

interface Props {
  content: string;
  style: 'technical' | 'functional' | 'concise';
  onBeautify: (beautified: string) => void;
}

const BeautifyButton: React.FC<Props> = ({ content, onBeautify }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBeautify = async (selectedStyle: 'technical' | 'functional' | 'concise') => {
    if (!content || content.trim().length === 0) {
      alert('Please enter some content to beautify first.');
      return;
    }

    setIsLoading(true);
    setShowDropdown(false);

    try {
      const response = await beautifyText({
        content,
        style: selectedStyle,
      });

      if (response.success && response.data?.beautifiedContent) {
        onBeautify(response.data.beautifiedContent);
      } else {
        alert(response.message || 'Failed to beautify text');
      }
    } catch (error) {
      console.error('Beautify error:', error);
      alert('Failed to beautify text. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
        className="btn-beautify flex items-center gap-1"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            AI...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            AI Beautify
          </>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button
              type="button"
              onClick={() => handleBeautify('technical')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Technical Format
            </button>
            <button
              type="button"
              onClick={() => handleBeautify('functional')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Functional Format
            </button>
            <button
              type="button"
              onClick={() => handleBeautify('concise')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Make Concise
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautifyButton;
