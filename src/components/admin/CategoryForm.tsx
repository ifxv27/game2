import { useState } from 'react';

interface CategoryFormProps {
  initialCategory?: any;
  onSubmit: (categoryData: any) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialCategory, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialCategory?.name || '',
    description: initialCategory?.description || '',
    displayGrid: initialCategory?.displayGrid || 'main',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialCategory?.id || `category-${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Category Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Display Grid
        </label>
        <select
          value={formData.displayGrid}
          onChange={(e) => setFormData({ ...formData, displayGrid: e.target.value })}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
          required
        >
          <option value="main">Main Grid</option>
          <option value="battle">Battle Grid</option>
          <option value="store">Store Grid</option>
          <option value="collection">Collection Grid</option>
          <option value="event">Event Grid</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          {initialCategory ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}
