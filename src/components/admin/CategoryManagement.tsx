import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface EditModalProps {
  category?: Category;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
}

const EditModal: React.FC<EditModalProps> = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4 text-white">
          {category ? 'Edit Category' : 'Add Category'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 p-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CategoryManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useGameStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (category: Omit<Category, 'id'>) => {
    addCategory(category);
    setShowAddModal(false);
  };

  const handleUpdate = (category: Omit<Category, 'id'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, category);
      setEditingCategory(null);
    }
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Category Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded"
          >
            <div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
              {category.description && (
                <p className="text-gray-400 mt-1">{category.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingCategory(category)}
                className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editingCategory || showAddModal) && (
        <EditModal
          category={editingCategory || undefined}
          onClose={() => {
            setEditingCategory(null);
            setShowAddModal(false);
          }}
          onSave={editingCategory ? handleUpdate : handleAdd}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
