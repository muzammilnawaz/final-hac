import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const AddVitals = () => {
  const [bp, setBp] = useState('');
  const [sugar, setSugar] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    api.get('/family').then(res => setFamilyMembers(res.data));
    gsap.from(formRef.current, { duration: 0.7, opacity: 0, scale: 0.9, ease: 'power3.out' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/vitals', {
        bp,
        sugar: sugar ? Number(sugar) : undefined,
        weight: weight ? Number(weight) : undefined,
        notes,
        memberId: selectedMember || undefined,
      });
      toast.success('Vitals added successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vitals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto max-w-lg">
      <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl text-white">
        <h1 className="text-3xl font-bold text-center text-cyan-400">Add Manual Vitals</h1>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">Who are these vitals for?</label>
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
        
        <Input placeholder="Blood Pressure (e.g., 120/80)" value={bp} onChange={(e) => setBp(e.target.value)} />
        <Input type="number" placeholder="Blood Sugar (mg/dL)" value={sugar} onChange={(e) => setSugar(e.target.value)} />
        <Input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <textarea
          placeholder="Notes (e.g., 'Felt dizzy')"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Vitals'}
        </Button>
      </form>
    </div>
  );
};
export default AddVitals;