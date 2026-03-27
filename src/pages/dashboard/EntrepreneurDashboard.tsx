import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle, CalendarDays, Video, Wallet, HelpCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';

const tourSteps = [
  { title: 'Welcome to Nexus!', content: 'This is your Entrepreneur Dashboard, your command center for managing your startup journey.', position: { top: '80px', left: '50%', transform: 'translateX(-50%)' } },
  { title: 'Your Stats', content: 'Track key metrics here, pending requests, connections, upcoming meetings, and profile views.', position: { top: '220px', left: '50%', transform: 'translateX(-50%)' } },
  { title: 'Quick Access', content: 'Quickly jump to Calendar, Video Calls, and Payments from these cards.', position: { top: '380px', left: '50%', transform: 'translateX(-50%)' } },
  { title: 'Collaboration Requests', content: 'Investor requests appear here. Accept or decline them directly from this panel.', position: { top: '520px', left: '200px' } },
  { title: 'Recommended Investors', content: 'Nexus recommends investors matching your startup profile. Click any card to view their full profile.', position: { top: '520px', right: '20px' } },
];

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
    const tourSeen = localStorage.getItem('nexus-tour-seen');
    if (!tourSeen) {
      setTimeout(() => setShowTour(true), 800);
    }
  }, [user]);

  const endTour = () => {
    setShowTour(false);
    setTourStep(0);
    localStorage.setItem('nexus-tour-seen', 'true');
  };

  const nextStep = () => {
    if (tourStep < tourSteps.length - 1) setTourStep(s => s + 1);
    else endTour();
  };

  const prevStep = () => {
    if (tourStep > 0) setTourStep(s => s - 1);
  };

  const startTour = () => {
    localStorage.removeItem('nexus-tour-seen');
    setTourStep(0);
    setShowTour(true);
  };

  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status } : req)
    );
  };

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  const step = tourSteps[tourStep];

  return (
    <div className="space-y-6 animate-fade-in" style={{ position: 'relative' }}>

      {/* Tour Overlay */}
      {showTour && (
        <>
          {/* Dark overlay */}
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={endTour} />

          {/* Tooltip */}
          <div style={{
            position: 'fixed',
            ...step.position,
            zIndex: 1000,
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            width: '320px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {tourSteps.map((_, i) => (
                <div key={i} style={{ width: i === tourStep ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === tourStep ? '#6366f1' : '#e2e8f0', transition: 'all 0.3s' }} />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{step.title}</h3>
              <button onClick={endTour} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{step.content}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={endTour}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '13px', padding: 0 }}
              >Skip tour</button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {tourStep > 0 && (
                  <button onClick={prevStep} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ChevronLeft size={14} /> Back
                  </button>
                )}
                <button onClick={nextStep} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'} {tourStep < tourSteps.length - 1 && <ChevronRight size={14} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>
              {tourStep + 1} of {tourSteps.length}
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={startTour}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0',
              background: '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <HelpCircle size={15} /> Tour
          </button>
          <Link to="/investors">
            <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(r => r.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">2</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Profile Views</p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Access Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[
          { to: '/calendar', Icon: CalendarDays, label: 'Meeting Calendar', desc: 'Schedule & manage meetings', color: '#6366f1', bg: '#f5f3ff' },
          { to: '/videocall', Icon: Video, label: 'Video Calls', desc: 'Connect face to face', color: '#0ea5e9', bg: '#f0f9ff' },
          { to: '/payments', Icon: Wallet, label: 'Payments', desc: 'Track funding & transactions', color: '#16a34a', bg: '#f0fdf4' },
        ].map(({ to, Icon, label, desc, color, bg }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div
              style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{label}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard key={investor.id} investor={investor} showActions={false} />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};