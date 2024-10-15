import React, { useState, useEffect, useMemo } from 'react';
import { Blip } from './types';
import RadarChart from './components/RadarChart';
import BlipForm from './components/BlipForm';
import BlipList from './components/BlipList';
import SearchFilter from './components/SearchFilter';
import OverviewPage from './components/OverviewPage';
import { PlusCircle } from 'lucide-react';
import { supabase, testSupabaseConnection } from './supabaseClient';

const App: React.FC = () => {
  const [blips, setBlips] = useState<Blip[]>([]);
  const [selectedBlip, setSelectedBlip] = useState<Blip | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuadrant, setFilterQuadrant] = useState<string | null>(null);
  const [filterRing, setFilterRing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'radar' | 'overview'>('radar');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        const isConnected = await testSupabaseConnection();
        console.log('Supabase connection test result:', isConnected);
        if (isConnected) {
          await fetchBlips();
        } else {
          setError('Failed to connect to the database. Please try again later.');
        }
      } catch (err) {
        console.error('Error during app initialization:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  async function fetchBlips() {
    setIsLoading(true);
    try {
      console.log('Fetching blips...');
      const { data, error } = await supabase
        .from('blips')
        .select('*');
      
      if (error) throw error;
      
      console.log('Fetched blips:', data);
      setBlips(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching blips:', err);
      setError('Failed to fetch blips. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const addBlip = async (blip: Omit<Blip, 'id'>) => {
    const { data, error } = await supabase
      .from('blips')
      .insert([blip])
      .select();
    if (error) {
      console.error('Error adding blip:', error);
      return;
    }
    setBlips([...blips, data[0]]);
  };

  const updateBlip = async (updatedBlip: Blip) => {
    const { error } = await supabase
      .from('blips')
      .update(updatedBlip)
      .eq('id', updatedBlip.id);
    if (error) {
      console.error('Error updating blip:', error);
      return;
    }
    setBlips(blips.map(blip => blip.id === updatedBlip.id ? updatedBlip : blip));
  };

  const deleteBlip = async (id: string) => {
    const { error } = await supabase
      .from('blips')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting blip:', error);
      return;
    }
    setBlips(blips.filter(blip => blip.id !== id));
  };

  const filteredBlips = useMemo(() => {
    return blips.filter(blip => {
      const matchesSearch = blip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            blip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            blip.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQuadrant = !filterQuadrant || blip.quadrant === filterQuadrant;
      const matchesRing = !filterRing || blip.ring === filterRing;
      return matchesSearch && matchesQuadrant && matchesRing;
    });
  }, [blips, searchTerm, filterQuadrant, filterRing]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">TechRadar</h1>
          <nav>
            <button
              className={`mr-4 ${currentPage === 'radar' ? 'font-bold' : ''}`}
              onClick={() => setCurrentPage('radar')}
            >
              Radar
            </button>
            <button
              className={currentPage === 'overview' ? 'font-bold' : ''}
              onClick={() => setCurrentPage('overview')}
            >
              Overview
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterQuadrant={filterQuadrant}
          setFilterQuadrant={setFilterQuadrant}
          filterRing={filterRing}
          setFilterRing={setFilterRing}
        />
        {currentPage === 'radar' ? (
          <div className="flex flex-col lg:flex-row gap-8 mt-4">
            <div className="w-full lg:w-3/4">
              {filteredBlips.length > 0 ? (
                <RadarChart blips={filteredBlips} onBlipClick={setSelectedBlip} />
              ) : (
                <div className="flex items-center justify-center h-[800px] bg-gray-100">
                  <p className="text-gray-500">No blips to display. Try adjusting your filters or adding new blips.</p>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/4">
              <button
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => setIsFormOpen(true)}
              >
                <PlusCircle className="mr-2" />
                Add New Blip
              </button>
              <BlipList
                blips={filteredBlips}
                onEdit={setSelectedBlip}
                onDelete={deleteBlip}
              />
            </div>
          </div>
        ) : (
          <OverviewPage blips={filteredBlips} />
        )}
      </main>
      {(isFormOpen || selectedBlip) && (
        <BlipForm
          blip={selectedBlip}
          onSave={(blip) => {
            if (selectedBlip) {
              updateBlip({ ...blip, id: selectedBlip.id });
            } else {
              addBlip(blip);
            }
            setSelectedBlip(null);
            setIsFormOpen(false);
          }}
          onCancel={() => {
            setSelectedBlip(null);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default App;