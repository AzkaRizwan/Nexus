import React, { useState } from 'react';

interface Participant {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    isMuted: boolean;
    isVideoOff: boolean;
    isSpeaking: boolean;
}

const participants: Participant[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Entrepreneur',
        avatarUrl: '',
        isMuted: false,
        isVideoOff: false,
        isSpeaking: true,
    },
    {
        id: '2',
        name: 'James Wilson',
        role: 'Investor',
        avatarUrl: '',
        isMuted: true,
        isVideoOff: false,
        isSpeaking: false,
    },
];

export const VideoCallPage: React.FC = () => {
    const [callActive, setCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { id: '1', sender: 'James Wilson', text: 'Looking forward to discussing the investment opportunity!', time: '10:02' },
        { id: '2', sender: 'You', text: 'Me too! I have the pitch deck ready.', time: '10:03' },
    ]);

    const startCall = () => {
        setCallActive(true);
        setCallDuration(0);
        const ref = setInterval(() => setCallDuration(d => d + 1), 1000);
        setTimerRef(ref);
    };

    const endCall = () => {
        setCallActive(false);
        if (timerRef) clearInterval(timerRef);
        setTimerRef(null);
        setCallDuration(0);
        setIsMuted(false);
        setIsVideoOff(false);
        setIsScreenSharing(false);
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const sendMessage = () => {
        if (!chatMessage.trim()) return;
        setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'You',
            text: chatMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        setChatMessage('');
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Video Calls</h1>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>Connect face-to-face with investors and entrepreneurs</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showChat ? '1fr 320px' : '1fr', gap: '24px' }}>
                {/* Main Video Area */}
                <div>
                    {!callActive ? (
                        /* Pre-call Screen */
                        <div>
                            {/* Upcoming Calls */}
                            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
                                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Scheduled Calls</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { name: 'James Wilson', role: 'Investor', time: 'Today, 2:00 PM', topic: 'Series A Discussion', color: '#6366f1' },
                                        { name: 'Amina Yusuf', role: 'Investor', time: 'Tomorrow, 11:00 AM', topic: 'Portfolio Review', color: '#8b5cf6' },
                                        { name: 'Marcus Lee', role: 'Entrepreneur', time: 'Mar 29, 3:00 PM', topic: 'Co-founder Meeting', color: '#14b8a6' },
                                    ].map((call, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '44px', height: '44px', borderRadius: '50%', background: call.color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#fff', fontWeight: 700, fontSize: '16px',
                                                }}>
                                                    {call.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{call.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{call.role} · {call.topic}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>{call.time}</div>
                                                <button
                                                    onClick={startCall}
                                                    style={{
                                                        padding: '8px 16px', borderRadius: '8px', border: 'none',
                                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                        color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                                                    }}
                                                >Join Call</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Call */}
                            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Start a Quick Call</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    {participants.map((p, i) => (
                                        <div key={p.id} style={{
                                            padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                            textAlign: 'center', background: '#f8fafc',
                                        }}>
                                            <div style={{
                                                width: '56px', height: '56px', borderRadius: '50%', background: avatarColors[i % avatarColors.length],
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontWeight: 700, fontSize: '20px', margin: '0 auto 12px',
                                            }}>
                                                {getInitials(p.name)}
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{p.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{p.role}</div>
                                            <button
                                                onClick={startCall}
                                                style={{
                                                    width: '100%', padding: '8px', borderRadius: '8px', border: 'none',
                                                    background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                                                }}
                                            >📞 Call</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Active Call Screen */
                        <div style={{ background: '#0f172a', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                            {/* Call Header */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px 24px', background: 'rgba(255,255,255,0.05)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Live Call</span>
                                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>{formatDuration(callDuration)}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setShowChat(!showChat)}
                                        style={{
                                            padding: '6px 14px', borderRadius: '8px', border: 'none',
                                            background: showChat ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                            color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
                                        }}
                                    >💬 Chat</button>
                                </div>
                            </div>

                            {/* Video Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px', minHeight: '400px' }}>
                                {/* Main participant */}
                                <div style={{
                                    gridColumn: '1 / -1', background: 'linear-gradient(135deg, #1e293b, #334155)',
                                    borderRadius: '12px', minHeight: '280px', display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', position: 'relative',
                                }}>
                                    {isVideoOff ? (
                                        <div style={{
                                            width: '80px', height: '80px', borderRadius: '50%', background: '#6366f1',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontSize: '32px', fontWeight: 700,
                                        }}>SJ</div>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '50%', background: '#6366f1',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontSize: '32px', fontWeight: 700, margin: '0 auto 12px',
                                                boxShadow: '0 0 0 4px rgba(99,102,241,0.3)',
                                            }}>SJ</div>
                                            <div style={{ color: '#94a3b8', fontSize: '13px' }}>Camera preview active</div>
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute', bottom: '12px', left: '12px',
                                        background: 'rgba(0,0,0,0.6)', borderRadius: '8px', padding: '4px 10px',
                                        color: '#fff', fontSize: '13px', fontWeight: 600,
                                    }}>
                                        You {isMuted && '🔇'}
                                    </div>
                                    {isScreenSharing && (
                                        <div style={{
                                            position: 'absolute', top: '12px', right: '12px',
                                            background: '#22c55e', borderRadius: '8px', padding: '4px 10px',
                                            color: '#fff', fontSize: '12px', fontWeight: 600,
                                        }}>📺 Sharing Screen</div>
                                    )}
                                </div>

                                {/* Other participants */}
                                {participants.map((p, i) => (
                                    <div key={p.id} style={{
                                        background: 'linear-gradient(135deg, #1e293b, #334155)',
                                        borderRadius: '12px', minHeight: '140px', display: 'flex',
                                        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                        border: p.isSpeaking ? '2px solid #22c55e' : '2px solid transparent',
                                    }}>
                                        <div style={{
                                            width: '52px', height: '52px', borderRadius: '50%',
                                            background: avatarColors[i % avatarColors.length],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontSize: '20px', fontWeight: 700,
                                        }}>{getInitials(p.name)}</div>
                                        <div style={{
                                            position: 'absolute', bottom: '8px', left: '8px',
                                            background: 'rgba(0,0,0,0.6)', borderRadius: '6px', padding: '3px 8px',
                                            color: '#fff', fontSize: '12px', fontWeight: 600,
                                        }}>
                                            {p.name.split(' ')[0]} {p.isMuted && '🔇'}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Controls */}
                            <div style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                                padding: '20px', background: 'rgba(255,255,255,0.03)',
                            }}>
                                {[
                                    { label: isMuted ? '🔇' : '🎤', active: !isMuted, onClick: () => setIsMuted(!isMuted), title: isMuted ? 'Unmute' : 'Mute' },
                                    { label: isVideoOff ? '📷' : '📹', active: !isVideoOff, onClick: () => setIsVideoOff(!isVideoOff), title: isVideoOff ? 'Start Video' : 'Stop Video' },
                                    { label: '🖥️', active: isScreenSharing, onClick: () => setIsScreenSharing(!isScreenSharing), title: 'Share Screen' },
                                ].map((btn, i) => (
                                    <button
                                        key={i}
                                        onClick={btn.onClick}
                                        title={btn.title}
                                        style={{
                                            width: '52px', height: '52px', borderRadius: '50%', border: 'none',
                                            background: btn.active ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.3)',
                                            color: '#fff', fontSize: '20px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s',
                                        }}
                                    >{btn.label}</button>
                                ))}

                                {/* End Call */}
                                <button
                                    onClick={endCall}
                                    style={{
                                        padding: '14px 28px', borderRadius: '50px', border: 'none',
                                        background: '#ef4444', color: '#fff', fontWeight: 700,
                                        fontSize: '15px', cursor: 'pointer', marginLeft: '8px',
                                    }}
                                >📵 End Call</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                {showChat && callActive && (
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                            💬 Call Chat
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {chatMessages.map(msg => (
                                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'You' ? 'flex-end' : 'flex-start' }}>
                                    {msg.sender !== 'You' && (
                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>{msg.sender}</div>
                                    )}
                                    <div style={{
                                        padding: '10px 14px', borderRadius: '12px', maxWidth: '80%',
                                        background: msg.sender === 'You' ? '#6366f1' : '#f1f5f9',
                                        color: msg.sender === 'You' ? '#fff' : '#0f172a',
                                        fontSize: '13px',
                                    }}>{msg.text}</div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{msg.time}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                            <input
                                value={chatMessage}
                                onChange={e => setChatMessage(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                    fontSize: '13px', outline: 'none',
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                style={{
                                    padding: '8px 14px', borderRadius: '8px', border: 'none',
                                    background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer',
                                }}
                            >➤</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};