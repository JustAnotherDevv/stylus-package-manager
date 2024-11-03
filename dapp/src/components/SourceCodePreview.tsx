import React from 'react';
import { Copy } from 'lucide-react';

interface SourceCodePreviewProps {
  code: string;
  language?: string;
}

export default function SourceCodePreview({ code, language = 'rust' }: SourceCodePreviewProps) {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <span className="text-sm text-gray-400">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-gray-400 hover:text-white"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-300">{code}</code>
      </pre>
    </div>
  );
}