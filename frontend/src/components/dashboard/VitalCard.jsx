import React from 'react';

const VitalCard = ({ vital }) => {
  const vitalDate = new Date(vital.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-5 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 hover:shadow-purple-400/20 hover:border-purple-400 border border-transparent">
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 text-xs font-semibold text-purple-900 bg-purple-400 rounded-full">
            Manual Vital
          </span>
          <p className="mt-2 text-sm text-gray-400">Date: {vitalDate}</p>
        </div>
        {/* Vitals data */}
        <div className="flex space-x-4 text-right text-white">
          {vital.bp && <span className="font-semibold">BP: {vital.bp}</span>}
          {vital.sugar && <span className="font-semibold">Sugar: {vital.sugar} mg/dL</span>}
          {vital.weight && <span className="font-semibold">Weight: {vital.weight} kg</span>}
        </div>
      </div>
      {vital.notes && (
        <p className="mt-3 text-sm text-gray-300 italic">
          <strong>Notes:</strong> "{vital.notes}"
        </p>
      )}
    </div>
  );
};

export default VitalCard;