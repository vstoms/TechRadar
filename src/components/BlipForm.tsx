import React, { useState, useEffect } from 'react';
import { Blip } from '../types';
import { X } from 'lucide-react';

interface BlipFormProps {
  blip?: Blip | null;
  onSave: (blip: Omit<Blip, 'id'>) => void;
  onCancel: () => void;
}

const BlipForm: React.FC<BlipFormProps> = ({ blip, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Blip, 'id'>>({
    name: '',
    quadrant: 'Techniques',
    ring: 'Adopt',
    description: '',
    owner: '',
  });

  useEffect(() => {
    if (blip) {
      setFormData({
        name: blip.name,
        quadrant: blip.quadrant,
        ring: blip.ring,
        description: blip.description,
        owner: blip.owner,
      });
    }
  }, [blip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{blip ? 'Edit Blip' : 'Add New Blip'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="quadrant" className="block text-sm font-medium text-gray-700">Quadrant</label>
            <select
              id="quadrant"
              name="quadrant"
              value={formData.quadrant}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="Techniques">Techniques</option>
              <option value="Tools">Tools</option>
              <option value="Platforms">Platforms</option>
              <option value="Languages & Frameworks">Languages & Frameworks</option>
            </select>
          </div>
          <div>
            <label htmlFor="ring" className="block text-sm font-medium text-gray-700">Ring</label>
            <select
              id="ring"
              name="ring"
              value={formData.ring}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="Adopt">Adopt</option>
              <option value="Trial">Trial</option>
              <option value="Assess">Assess</option>
              <option value="Hold">Hold</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {blip ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlipForm;