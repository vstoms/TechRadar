import React, { useState, useEffect } from 'react';
import { Blip } from '../types';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Info } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OverviewPageProps {
  blips: Blip[];
}

const OverviewPage: React.FC<OverviewPageProps> = ({ blips }) => {
  console.log('OverviewPage rendering, blips:', blips);
  const [selectedBlip, setSelectedBlip] = useState<Blip | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (blips.length === 0) {
      setError('No blips available. Please add some blips to view the overview.');
    } else {
      setError(null);
    }
  }, [blips]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Note</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const quadrantCounts = blips.reduce((acc, blip) => {
    acc[blip.quadrant] = (acc[blip.quadrant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ringCounts = blips.reduce((acc, blip) => {
    acc[blip.ring] = (acc[blip.ring] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const quadrantChartData = {
    labels: Object.keys(quadrantCounts),
    datasets: [
      {
        data: Object.values(quadrantCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const ringChartData = {
    labels: Object.keys(ringCounts),
    datasets: [
      {
        data: Object.values(ringCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">TechRadar Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quadrant Distribution</h2>
          <Pie data={quadrantChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ring Distribution</h2>
          <Pie data={ringChartData} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Blips</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Quadrant</th>
                <th className="px-4 py-2 text-left">Ring</th>
                <th className="px-4 py-2 text-left">Owner</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blips.map((blip) => (
                <tr key={blip.id} className="border-b">
                  <td className="px-4 py-2">{blip.name}</td>
                  <td className="px-4 py-2">{blip.quadrant}</td>
                  <td className="px-4 py-2">{blip.ring}</td>
                  <td className="px-4 py-2">{blip.owner}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedBlip(blip)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Info size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBlip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedBlip.name}</h2>
            <p className="mb-2"><strong>Quadrant:</strong> {selectedBlip.quadrant}</p>
            <p className="mb-2"><strong>Ring:</strong> {selectedBlip.ring}</p>
            <p className="mb-2"><strong>Owner:</strong> {selectedBlip.owner}</p>
            <p className="mb-4"><strong>Description:</strong> {selectedBlip.description}</p>
            <button
              onClick={() => setSelectedBlip(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;