import React from 'react';

const FamilyMemberCard = ({ member, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-md">
      <div>
        <h3 className="text-xl font-bold text-cyan-400">{member.name}</h3>
        <p className="text-gray-300">{member.relationship}</p>
        {member.notes && <p className="text-sm text-gray-400 italic mt-1">{member.notes}</p>}
      </div>
      <div className="flex space-x-2">
        {/* Edit button (future functionality) */}
        {/* <button className="px-3 py-1 text-sm font-medium text-gray-900 bg-yellow-400 rounded-md hover:bg-yellow-300">
          Edit
        </button> */}
        <button 
          onClick={() => onDelete(member._id)}
          className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FamilyMemberCard;