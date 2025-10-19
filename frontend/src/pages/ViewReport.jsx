import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import AiSummary from '../components/dashboard/AiSummary';
import Loader from '../components/common/Loader'; // Apna Tailwind loader
import { gsap } from 'gsap';

const ViewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const pdfRef = useRef(null);
  const aiRef = useRef(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/reports/${id}`);
        setReport(data);
      } catch (error) {
        toast.error('Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (report) {
      gsap.from(pdfRef.current, { duration: 1, opacity: 0, x: -50, ease: 'power3.out' });
      gsap.from(aiRef.current, { duration: 1, opacity: 0, x: 50, delay: 0.3, ease: 'power3.out' });
    }
  }, [report]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (!report) return <div className="text-center text-white">Report not found.</div>;

  return (
    <div className="container p-4 mx-auto max-w-7xl">
      <h1 className="mb-4 text-3xl font-bold text-white">{report.reportName}</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div ref={pdfRef} className="bg-gray-800 rounded-lg shadow-lg">
          <embed 
            src={report.fileUrl} 
            type="application/pdf" 
            className="w-full h-[80vh] rounded-lg"
          />
        </div>
        <div ref={aiRef} className="overflow-y-auto h-[80vh]">
          <AiSummary report={report} />
        </div>
      </div>
    </div>
  );
};
export default ViewReport;