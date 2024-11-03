import React, { useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';

export default function PublishPackage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '',
    sourceCode: '',
    tags: [] as string[],
    currentTag: ''
  });

  const addTag = () => {
    if (formData.currentTag && !formData.tags.includes(formData.currentTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.currentTag],
        currentTag: ''
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Publish New Package</h1>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Package Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                Version
              </label>
              <input
                type="text"
                id="version"
                placeholder="1.0.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="sourceCode" className="block text-sm font-medium text-gray-700">
                Source Code
              </label>
              <textarea
                id="sourceCode"
                rows={10}
                value={formData.sourceCode}
                onChange={(e) => setFormData({ ...formData, sourceCode: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={formData.currentTag}
                  onChange={(e) => setFormData({ ...formData, currentTag: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 rounded-l-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-purple-600 hover:text-purple-900"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                Publish Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}