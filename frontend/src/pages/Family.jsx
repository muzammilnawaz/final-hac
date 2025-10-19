import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import FamilyMemberCard from "../components/common/FamilyMemberCard.jsx"; 
import Loader from "../components/common/Loader.jsx";

const Family = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  
  const formRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    fetchMembers();
    gsap.from(formRef.current, { duration: 0.7, opacity: 0, x: -50, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.from(listRef.current.children, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }
  }, [loading, members]);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/family');
      setMembers(data);
    } catch (error) {
      toast.error('Could not fetch family members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !relationship) {
      toast.error('Name and relationship are required');
      return;
    }
    try {
      await api.post('/family', { name, relationship, notes });
      toast.success('Member added!');
      setName('');
      setRelationship('');
      setNotes('');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to add member');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
        try {
            await api.delete(`/family/${id}`);
            toast.success('Member deleted');
            fetchMembers();
        } catch (error) {
            toast.error('Failed to delete member');
        }
    }
  };

  return (
    <div className="container p-4 mx-auto max-w-6xl text-white">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Form Section */}
        <div ref={formRef} className="p-6 bg-gray-800 rounded-lg shadow-xl md:col-span-1">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Add Family Member</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Relationship (e.g., Father)" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
            <textarea
              placeholder="Notes (e.g., Blood Group, Allergies)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Button type="submit">Add Member</Button>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Your Family Members</h2>
          {loading ? (
            <Loader />
          ) : (
            <div ref={listRef} className="space-y-4">
              {members.length === 0 ? (
                <p>No family members added yet.</p>
              ) : (
                members.map(member => (
                  <FamilyMemberCard 
                    key={member._id} 
                    member={member} 
                    onDelete={handleDelete} 
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Family;