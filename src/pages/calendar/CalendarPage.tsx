import React, { useState } from 'react';

interface Meeting {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    with: string;
    type: 'scheduled' | 'pending' | 'declined';
    description: string;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

const initialMeetings: Meeting[] = [
    {
        id: '1',
        title: 'Investment Discussion',
        date: '2026-03-28',
        time: '10:00',
        duration: '60',
        with: 'Sarah Chen',
        type: 'scheduled',
        description: 'Discussing Series A funding opportunity for TechVenture startup.',
    },
    {
        id: '2',
        title: 'Pitch Review',
        date: '2026-03-30',
        time: '14:00',
        duration: '30',
        with: 'James Wilson',
        type: 'pending',
        description: 'Review of Q2 pitch deck and financial projections.',
    },
    {
        id: '3',
        title: 'Portfolio Check-in',
        date: '2026-04-02',
        time: '11:00',
        duration: '45',
        with: 'Amina Yusuf',
        type: 'scheduled',
        description: 'Quarterly check-in on portfolio performance.',
    },
];

const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '12:00', available: true },
    { time: '13:00', available: false },
    { time: '14:00', available: false },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: true },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

export const CalendarPage: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'calendar' | 'requests'>('calendar');
    const [newMeeting, setNewMeeting] = useState({
        title: '',
        date: '',
        time: '',
        duration: '30',
        with: '',
        description: '',
    });

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    const formatDate = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const getMeetingsForDate = (dateStr: string) => {
        return meetings.filter(m => m.date === dateStr);
    };

    const hasMeeting = (day: number) => {
        const dateStr = formatDate(currentYear, currentMonth, day);
        return meetings.some(m => m.date === dateStr);
    };

    const handleAddMeeting = () => {
        if (!newMeeting.title || !newMeeting.date || !newMeeting.time || !newMeeting.with) return;
        const meeting: Meeting = {
            id: Date.now().toString(),
            ...newMeeting,
            type: 'pending',
        };
        setMeetings(prev => [...prev, meeting]);
        setShowModal(false);
        setNewMeeting({ title: '', date: '', time: '', duration: '30', with: '', description: '' });
    };

    const handleStatusChange = (id: string, status: Meeting['type']) => {
        setMeetings(prev => prev.map(m => m.id === id ? { ...m, type: status } : m));
    };

    const pendingMeetings = meetings.filter(m => m.type === 'pending');
    const selectedMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

    const typeColor = (type: Meeting['type']) => {
        if (type === 'scheduled') return '#22c55e';
        if (type === 'pending') return '#f59e0b';
        return '#ef4444';
    };

    const typeBg = (type: Meeting['type']) => {
        if (type === 'scheduled') return 'rgba(34,197,94,0.1)';
        if (type === 'pending') return 'rgba(245,158,11,0.1)';
        return 'rgba(239,68,68,0.1)';
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Meeting Scheduler</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>Manage your availability and meeting requests</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    + Schedule Meeting
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {(['calendar', 'requests'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            background: activeTab === tab ? '#6366f1' : '#f1f5f9',
                            color: activeTab === tab ? '#fff' : '#64748b',
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab === 'calendar' ? '📅 Calendar' : `📨 Requests ${pendingMeetings.length > 0 ? `(${pendingMeetings.length})` : ''}`}
                    </button>
                ))}
            </div>

            {activeTab === 'calendar' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                    {/* Left — Calendar */}
                    <div>
                        {/* Calendar Card */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
                            {/* Month Nav */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <button onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px' }}>‹</button>
                                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{MONTHS[currentMonth]} {currentYear}</h2>
                                <button onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px' }}>›</button>
                            </div>

                            {/* Day Headers */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {DAYS.map(d => (
                                    <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94a3b8', padding: '4px' }}>{d}</div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = formatDate(currentYear, currentMonth, day);
                                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                    const isSelected = dateStr === selectedDate;
                                    const hasMtg = hasMeeting(day);

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDate(isSelected ? '' : dateStr)}
                                            style={{
                                                textAlign: 'center',
                                                padding: '8px 4px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                background: isSelected ? '#6366f1' : isToday ? '#ede9fe' : 'transparent',
                                                color: isSelected ? '#fff' : isToday ? '#6366f1' : '#334155',
                                                fontWeight: isToday || isSelected ? 700 : 400,
                                                fontSize: '14px',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            {day}
                                            {hasMtg && (
                                                <div style={{
                                                    width: '5px', height: '5px', borderRadius: '50%',
                                                    background: isSelected ? '#fff' : '#6366f1',
                                                    margin: '2px auto 0',
                                                }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Availability Slots */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Your Availability Today</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {timeSlots.map(slot => (
                                    <div
                                        key={slot.time}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: `1px solid ${slot.available ? '#bbf7d0' : '#fecaca'}`,
                                            background: slot.available ? '#f0fdf4' : '#fff5f5',
                                            textAlign: 'center',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: slot.available ? '#16a34a' : '#dc2626',
                                        }}
                                    >
                                        {slot.time}
                                        <div style={{ fontSize: '11px', fontWeight: 400, marginTop: '2px' }}>{slot.available ? 'Available' : 'Booked'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Selected Day Meetings */}
                    <div>
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                                {selectedDate ? `Meetings on ${selectedDate}` : 'Upcoming Meetings'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {(selectedDate ? selectedMeetings : meetings).length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: '14px' }}>
                                        No meetings {selectedDate ? 'on this day' : 'scheduled'}
                                    </div>
                                ) : (
                                    (selectedDate ? selectedMeetings : meetings).map(meeting => (
                                        <div key={meeting.id} style={{
                                            padding: '14px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            background: typeBg(meeting.type),
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{meeting.title}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>with {meeting.with}</div>
                                                </div>
                                                <span style={{
                                                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                                                    background: typeBg(meeting.type), color: typeColor(meeting.type),
                                                    border: `1px solid ${typeColor(meeting.type)}`,
                                                }}>
                                                    {meeting.type}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                                                📅 {meeting.date} · ⏰ {meeting.time} · ⏱ {meeting.duration} min
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{meeting.description}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Pending Meeting Requests</h3>
                    {pendingMeetings.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>No pending requests</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {pendingMeetings.map(meeting => (
                                <div key={meeting.id} style={{
                                    padding: '20px', borderRadius: '12px', border: '1px solid #fde68a', background: '#fffbeb',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{meeting.title}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>with {meeting.with} · {meeting.date} at {meeting.time}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{meeting.description}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                                        <button
                                            onClick={() => handleStatusChange(meeting.id, 'scheduled')}
                                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                                        >Accept</button>
                                        <button
                                            onClick={() => handleStatusChange(meeting.id, 'declined')}
                                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                                        >Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Meeting Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '480px', maxWidth: '90vw' }}>
                        <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Schedule a Meeting</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'Meeting Title', key: 'title', type: 'text', placeholder: 'e.g. Investment Discussion' },
                                { label: 'With (Name)', key: 'with', type: 'text', placeholder: 'e.g. Sarah Chen' },
                                { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                                { label: 'Time', key: 'time', type: 'time', placeholder: '' },
                            ].map(field => (
                                <div key={field.key}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={newMeeting[field.key as keyof typeof newMeeting]}
                                        onChange={e => setNewMeeting(prev => ({ ...prev, [field.key]: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Duration</label>
                                <select
                                    value={newMeeting.duration}
                                    onChange={e => setNewMeeting(prev => ({ ...prev, duration: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Description</label>
                                <textarea
                                    placeholder="What is this meeting about?"
                                    value={newMeeting.description}
                                    onChange={e => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#64748b' }}
                            >Cancel</button>
                            <button
                                onClick={handleAddMeeting}
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                            >Schedule Meeting</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};