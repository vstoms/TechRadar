import React from 'react';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterQuadrant: string | null;
  setFilterQuadrant: (quadrant: string | null) => void;
  filterRing: string | null;
  setFilterRing: (ring: string | null) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filterQuadrant,
  setFilterQuadrant,
  filterRing,
  setFilterRing,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search blips..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      <div className="flex space-x-4">
        <select
          value={filterQuadrant || ''}
          onChange={(e) => setFilterQuadrant(e.target.value || null)}
          className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Quadrants</option>
          <option value="Techniques">Techniques</option>
          <option value="Tools">Tools</option>
          <option value="Platforms">Platforms</option>
          <option value="Languages & Frameworks">Languages & Frameworks</option>
        </select>
        <select
          value={filterRing || ''}
          onChange={(e) => setFilterRing(e.target.value || null)}
          className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Rings</option>
          <option value="Adopt">Adopt</option>
          <option value="Trial">Trial</option>
          <option value="Assess">Assess</option>
          <option value="Hold">Hold</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;