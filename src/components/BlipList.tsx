import React from 'react';
import { Blip } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface BlipListProps {
  blips: Blip[];
  onEdit: (blip: Blip) => void;
  onDelete: (id: string) => void;
}

const BlipList: React.FC<BlipListProps> = ({ blips, onEdit, onDelete }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Blips</h2>
      <ul className="space-y-2">
        {blips.map((blip) => (
          <li key={blip.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{blip.name}</h3>
              <p className="text-sm text-gray-500">{blip.quadrant} - {blip.ring}</p>
              <p className="text-sm text-gray-600">Owner: {blip.owner}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(blip)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(blip.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlipList;