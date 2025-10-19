import React, { useState } from 'react';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-semibold rounded-t-lg ${
      active
        ? 'bg-cyan-500 text-gray-900' // Active tab
        : 'bg-gray-700 text-white hover:bg-gray-600' // Inactive tab
    } transition-colors`}
  >
    {children}
  </button>
);

const AiSummary = ({ report }) => {
  const [lang, setLang] = useState('en'); // 'en' for English, 'ur' for Urdu

  return (
    <div className="p-6 space-y-4 text-white bg-gray-800 rounded-lg shadow-2xl">
      <h2 className="text-2xl font-bold text-cyan-400">
        Gemini AI Analysis
      </h2>
      
      [cite_start]{/* Bilingual Toggle [cite: 11] */}
      <div className="flex border-b border-gray-600">
        <TabButton active={lang === 'en'} onClick={() => setLang('en')}>
          English Summary
        </TabButton>
        <TabButton active={lang === 'ur'} onClick={() => setLang('ur')}>
          Roman Urdu
        </TabButton>
      </div>
      
      {/* Summary Text */}
      <div className="p-4 bg-gray-700 rounded-b-lg min-h-[100px]">
        {lang === 'en' ? report.aiSummary : report.aiRomanUrdu}
      </div>

      [cite_start]{/* Abnormal Values [cite: 28] */}
      {/* (Yeh feature humne Gemini prompt mein dala tha, agar data hai to dikhayein) */}
      {report.abnormalValues && report.abnormalValues.length > 0 && (
         <div className="pt-4">
            <h3 className="mb-2 text-xl font-semibold text-red-400">Abnormal Values</h3>
            <ul className="pl-5 space-y-1 list-disc">
              {report.abnormalValues.map((item, i) => (
                <li key={i}>
                  <strong>{item.parameter}:</strong> {item.value} ({item.status})
                </li>
              ))}
            </ul>
        </div>
      )}

      [cite_start]{/* Questions for Doctor [cite: 30] */}
      <div className="pt-4">
        <h3 className="mb-2 text-xl font-semibold text-cyan-400">Questions to Ask Your Doctor</h3>
        <ul className="pl-5 space-y-1 list-disc">
          {report.doctorQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>

      [cite_start]{/* Food & Remedies [cite: 31, 32] */}
      <div className="pt-4">
        <h3 className="mb-2 text-xl font-semibold text-cyan-400">Suggestions</h3>
        <p><strong className="text-gray-400">Food:</strong> {report.foodSuggestions}</p>
        <p><strong className="text-gray-400">Remedies:</strong> {report.remedies}</p>
      </div>
      
      [cite_start]{/* Disclaimer [cite: 33, 51] */}
      <div className="pt-4 mt-4 border-t border-gray-600">
        <p className="text-sm text-yellow-400">
          <strong>Disclaimer:</strong> {report.disclaimer || "AI is for understanding only, not for medical advice. Always consult your doctor."}
        </p>
      </div>
    </div>
  );
};

// YEH LINE AAPKE PAAS MISSING THI
export default AiSummary;