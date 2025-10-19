import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const UploadReport = () => {
  const [reportName, setReportName] = useState('');
  const [file, setFile] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(''); // Default 'Self'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    // Family members fetch karo
    api.get('/family')
      .then(res => setFamilyMembers(res.data))
      .catch(() => toast.error('Could not load family members'));
    
    // Form animation
    gsap.from(formRef.current, { duration: 0.7, opacity: 0, scale: 0.9, ease: 'power3.out' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('reportName', reportName || file.name);
    formData.append('reportFile', file);
    if (selectedMember) {
      formData.append('memberId', selectedMember);
    }

    try {
      await api.post('/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Report uploaded successfully! AI analysis is starting.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto max-w-lg">
      <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl text-white">
        <h1 className="text-3xl font-bold text-center text-cyan-400">Upload Report</h1>
        
        <Input placeholder="Report Name (e.g., Blood Test)" value={reportName} onChange={(e) => setReportName(e.target.value)} />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">Select File (PDF, JPG, PNG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-gray-900 hover:file:bg-cyan-400"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">Who is this report for?</label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">For Me (Self)</option>
            {familyMembers.map(member => (
              <option key={member._id} value={member._id}>{member.name} ({member.relationship})</option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload & Analyze'}
        </Button>
      </form>
    </div>
  );
};
export default UploadReport;