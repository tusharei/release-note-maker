import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<Props> = ({ 
  value, 
  onChange, 
  placeholder = 'Enter text...',
  height = '150px'
}) => {
  // Custom toolbar options
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'indent'
  ];

  return (
    <div className="rich-text-wrapper" style={{ marginTop: '12px', marginBottom: '24px', position: 'relative' }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: height }}
      />
      <style>{`
        .rich-text-wrapper {
          position: relative;
          z-index: 1;
          margin-top: 12px;
          margin-bottom: 24px;
          display: block;
          overflow: visible;
        }
        .rich-text-wrapper .ql-container {
          min-height: ${height};
          font-size: 14px;
          background: white;
          position: relative;
          display: block;
        }
        .rich-text-wrapper .ql-editor {
          min-height: ${height};
          background: white;
          color: #374151;
          position: relative;
          display: block;
        }
        .rich-text-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 0;
        }
        .rich-text-wrapper .ql-toolbar {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          background: #f9fafb;
          position: relative;
          display: block;
        }
        .rich-text-wrapper .ql-container {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          border-color: #d1d5db;
        }
        .rich-text-wrapper .ql-toolbar {
          border-color: #d1d5db;
        }
        /* Ensure tooltips appear above */
        .ql-picker.ql-expanded .ql-picker-options,
        .ql-color-picker.ql-expanded .ql-picker-options,
        .ql-tooltip {
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
