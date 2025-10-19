import React from 'react';
import { Link } from 'react-router-dom';

const ReportCard = ({ report }) => {
  // Date ko format karein
  const reportDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-5 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 hover:shadow-cyan-400/20 hover:border-cyan-400 border border-transparent">
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 text-xs font-semibold text-cyan-900 bg-cyan-400 rounded-full">
            Lab Report
          </span>
          <h3 className="mt-2 text-xl font-bold text-white">{report.reportName}</h3>
          <p className="text-sm text-gray-400">Date: {reportDate}</p>
        </div>
        <Link
          to={`/report/${report._id}`}
          className="px-4 py-2 font-semibold text-gray-900 bg-gray-200 rounded-lg hover:bg-white transition"
        >
          View AI Summary
        </Link>
      </div>
    </div>
  );
};

export default ReportCard;