import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ReportCard from '../components/dashboard/ReportCard';
import VitalCard from '../components/dashboard/VitalCard';
import Loader from '../components/common/Loader';
import { gsap } from 'gsap';
import { useAuth } from "../context/Context.jsx"; // SAHI PATH (.)

// Icon components (using simple SVG for clean UI)
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>;
const VitalsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const FamilyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.003c0 1.113.285 2.16.786 3.07m-1.5-6.07c.283.6.468 1.25.468 1.94v.003c0 1.113-.285 2.16-.786 3.07M12.75 13.06c.283.6.468 1.25.468 1.94v.003c0 1.113-.285 2.16-.786 3.07M9.75 13.06c.283.6.468 1.25.468 1.94v.003c0 1.113-.285 2.16-.786 3.07M6.75 13.06c.283.6.468 1.25.468 1.94v.003c0 1.113-.285 2.16-.786 3.07M3 13.06c.283.6.468 1.25.468 1.94v.003c0 1.113-.285 2.16-.786 3.07" /></svg>;


const Dashboard = () => {
  const [timeline, setTimeline] = useState([]);
  const [stats, setStats] = useState({ reports: 0, vitals: 0, members: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // GSAP Refs
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, vitalsRes, familyRes] = await Promise.all([
          api.get('/reports'),
          api.get('/vitals'),
          api.get('/family')
        ]);
        
        setStats({
          reports: reportsRes.data.length,
          vitals: vitalsRes.data.length,
          members: familyRes.data.length
        });

        const reports = reportsRes.data.map(r => ({ ...r, type: 'report' }));
        const vitals = vitalsRes.data.map(v => ({ ...v, type: 'vital' }));
        
        const combined = [...reports, ...vitals].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setTimeline(combined);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!loading) {
      // Header Animation
      gsap.from(headerRef.current, { duration: 0.6, opacity: 0, y: -30, ease: 'power3.out' });
      
      // Stats Cards Animation
      gsap.from(statsRef.current.children, {
        duration: 0.5,
        opacity: 0,
        y: 30,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power3.out',
      });

      // Quick Actions Animation
      gsap.from(actionsRef.current.children, {
        duration: 0.5,
        opacity: 0,
        y: 30,
        stagger: 0.15,
        delay: 0.6,
        ease: 'power3.out',
      });

      // Timeline Animation
      gsap.from(timelineRef.current.children, {
        duration: 0.5,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        delay: 1, // Start after other animations
        ease: 'power3.out',
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto max-w-6xl text-white">
      {/* Header */}
      <div ref={headerRef} className="mb-8">
        <h1 className="text-4xl font-bold">Welcome back, {user?.fullName.split(' ')[0]}!</h1>
        <p className="text-xl text-gray-400">Here's your health summary.</p>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <StatCard title="Total Reports" value={stats.reports} color="cyan" />
        <StatCard title="Vitals Logged" value={stats.vitals} color="purple" />
        <StatCard title="Family Members" value={stats.members} color="green" />
      </div>

      {/* Quick Actions */}
      <div ref={actionsRef} className="grid grid-cols-1 gap-4 mb-12 md:grid-cols-3">
        <ActionCard to="/upload" title="Upload New Report" icon={<UploadIcon />} />
        <ActionCard to="/add-vitals" title="Add Manual Vitals" icon={<VitalsIcon />} />
        <ActionCard to="/family" title="Manage Family" icon={<FamilyIcon />} />
      </div>

      {/* Timeline */}
      <div>
        <h2 className="mb-6 text-3xl font-bold">Your Health Timeline</h2>
        {timeline.length === 0 ? (
          <p className="p-8 text-center bg-gray-800 rounded-lg">
            Your timeline is empty. <Link to="/upload" className="text-cyan-400 font-semibold">Upload your first report</Link> to get started.
          </p>
        ) : (
          <div ref={timelineRef} className="space-y-6">
            {timeline.map((item) => (
              item.type === 'report' 
                ? <ReportCard key={item._id} report={item} /> 
                : <VitalCard key={item._id} vital={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ title, value, color }) => {
  const colors = {
    cyan: "from-cyan-500 to-cyan-700",
    purple: "from-purple-500 to-purple-700",
    green: "from-green-500 to-green-700",
  };
  return (
    <div className={`p-6 bg-gradient-to-r ${colors[color]} rounded-lg shadow-lg`}>
      <p className="text-sm text-gray-200">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

const ActionCard = ({ to, title, icon }) => (
  <Link to={to} className="flex flex-col items-center justify-center p-6 space-y-3 text-white bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-gray-700">
    {icon}
    <p className="text-lg font-semibold">{title}</p>
  </Link>
);

export default Dashboard;