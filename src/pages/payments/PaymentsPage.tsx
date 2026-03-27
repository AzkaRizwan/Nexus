import React, { useState } from 'react';
import {
    ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Briefcase,
    BarChart2, CreditCard, Building2, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'transfer' | 'funding';
    amount: number;
    sender: string;
    receiver: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    description: string;
}

const initialTransactions: Transaction[] = [
    { id: '1', type: 'funding', amount: 50000, sender: 'James Wilson', receiver: 'You', status: 'completed', date: '2026-03-20', description: 'Series A Initial Funding' },
    { id: '2', type: 'transfer', amount: 5000, sender: 'You', receiver: 'Amina Yusuf', status: 'completed', date: '2026-03-18', description: 'Milestone Payment' },
    { id: '3', type: 'deposit', amount: 10000, sender: 'Bank Transfer', receiver: 'You', status: 'completed', date: '2026-03-15', description: 'Wallet Top-up' },
    { id: '4', type: 'withdrawal', amount: 3000, sender: 'You', receiver: 'Bank Account', status: 'pending', date: '2026-03-22', description: 'Withdrawal Request' },
    { id: '5', type: 'funding', amount: 25000, sender: 'Marcus Lee', receiver: 'You', status: 'completed', date: '2026-03-10', description: 'Seed Funding Round' },
    { id: '6', type: 'transfer', amount: 1500, sender: 'You', receiver: 'Sarah Chen', status: 'failed', date: '2026-03-08', description: 'Service Fee' },
];

const typeConfig = {
    deposit: { Icon: ArrowDownCircle, color: '#16a34a', bg: '#f0fdf4', label: 'Deposit' },
    withdrawal: { Icon: ArrowUpCircle, color: '#dc2626', bg: '#fef2f2', label: 'Withdrawal' },
    transfer: { Icon: ArrowLeftRight, color: '#6366f1', bg: '#f5f3ff', label: 'Transfer' },
    funding: { Icon: Briefcase, color: '#d97706', bg: '#fffbeb', label: 'Funding' },
};

const statusConfig = {
    completed: { Icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
    pending: { Icon: Clock, color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
    failed: { Icon: XCircle, color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
};

const tabs = [
    { key: 'overview', label: 'Overview', Icon: BarChart2 },
    { key: 'deposit', label: 'Deposit', Icon: ArrowDownCircle },
    { key: 'withdraw', label: 'Withdraw', Icon: ArrowUpCircle },
    { key: 'transfer', label: 'Transfer', Icon: ArrowLeftRight },
    { key: 'funding', label: 'Fund Deal', Icon: Briefcase },
] as const;

export const PaymentsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [activeTab, setActiveTab] = useState<typeof tabs[number]['key']>('overview');
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [description, setDescription] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [processing, setProcessing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | Transaction['status']>('all');

    const walletBalance = transactions.filter(t => t.status === 'completed').reduce((acc, t) => {
        if (t.receiver === 'You') return acc + t.amount;
        if (t.sender === 'You') return acc - t.amount;
        return acc;
    }, 0);
    const totalReceived = transactions.filter(t => t.receiver === 'You' && t.status === 'completed').reduce((a, t) => a + t.amount, 0);
    const totalSent = transactions.filter(t => t.sender === 'You' && t.status === 'completed').reduce((a, t) => a + t.amount, 0);
    const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((a, t) => a + t.amount, 0);
    const filteredTx = filterStatus === 'all' ? transactions : transactions.filter(t => t.status === filterStatus);

    const fmt = (n: number) => `$${n.toLocaleString()}`;
    const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

    const handleSubmit = (type: Transaction['type']) => {
        if (!amount || parseFloat(amount) <= 0) return;
        setProcessing(true);
        setTimeout(() => {
            const newTx: Transaction = {
                id: Date.now().toString(), type,
                amount: parseFloat(amount),
                sender: type === 'deposit' || type === 'funding' ? (recipient || 'External') : 'You',
                receiver: type === 'withdrawal' ? 'Bank Account' : (type === 'transfer' || type === 'funding') ? (recipient || 'Recipient') : 'You',
                status: 'pending',
                date: new Date().toISOString().split('T')[0],
                description: description || `${typeConfig[type].label} Transaction`,
            };
            setTransactions(prev => [newTx, ...prev]);
            setProcessing(false);
            setSuccessMsg(`${typeConfig[type].label} of ${fmt(parseFloat(amount))} submitted successfully!`);
            setAmount(''); setRecipient(''); setDescription('');
            setCardNumber(''); setCardName(''); setCardExpiry(''); setCardCvv('');
            setTimeout(() => { setSuccessMsg(''); setActiveTab('overview'); }, 3000);
        }, 1800);
    };

    const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' };
    const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' };

    const QuickAmounts = ({ vals }: { vals: string[] }) => (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${vals.length},1fr)`, gap: '8px' }}>
            {vals.map(v => (
                <button key={v} onClick={() => setAmount(v)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: amount === v ? '#6366f1' : '#f8fafc', color: amount === v ? '#fff' : '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ${parseInt(v).toLocaleString()}
                </button>
            ))}
        </div>
    );

    const SectionHeader = ({ Icon, iconColor, iconBg, title }: { Icon: React.ElementType; iconColor: string; iconBg: string; title: string }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={iconColor} />
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{title}</h3>
        </div>
    );

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Payments</h1>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>Manage your wallet, transactions and deal funding</p>
            </div>

            {successMsg && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={18} color="#16a34a" />
                    <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '14px' }}>{successMsg}</span>
                </div>
            )}

            {/* Wallet Card */}
            <div style={{ background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a78bfa 100%)', borderRadius: '20px', padding: '32px', marginBottom: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '12px', opacity: 0.75, marginBottom: '8px', fontWeight: 600, letterSpacing: '0.08em' }}>WALLET BALANCE</div>
                    <div style={{ fontSize: '44px', fontWeight: 800, marginBottom: '28px', letterSpacing: '-1px' }}>{fmt(walletBalance)}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                        {[
                            { label: 'Total Received', value: fmt(totalReceived), Icon: ArrowDownCircle },
                            { label: 'Total Sent', value: fmt(totalSent), Icon: ArrowUpCircle },
                            { label: 'Pending', value: fmt(pendingAmount), Icon: AlertCircle },
                        ].map(s => (
                            <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '16px' }}>
                                <s.Icon size={20} color="rgba(255,255,255,0.8)" style={{ marginBottom: '8px' }} />
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>{s.value}</div>
                                <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '3px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {tabs.map(({ key, label, Icon }) => (
                    <button key={key} onClick={() => setActiveTab(key)} style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: activeTab === key ? '#6366f1' : '#f1f5f9', color: activeTab === key ? '#fff' : '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s' }}>
                        <Icon size={15} />{label}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Transaction History</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {(['all', 'completed', 'pending', 'failed'] as const).map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: filterStatus === s ? '#6366f1' : '#f1f5f9', color: filterStatus === s ? '#fff' : '#64748b' }}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    {filteredTx.map(tx => {
                        const { Icon: TIcon, color: tColor, bg: tBg } = typeConfig[tx.type];
                        const { Icon: SIcon, color: sColor, bg: sBg, border: sBorder } = statusConfig[tx.status];
                        const isIn = tx.receiver === 'You';
                        return (
                            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f8fafc' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: tBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '14px' }}>
                                    <TIcon size={20} color={tColor} strokeWidth={2} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{tx.description}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{tx.sender} → {tx.receiver} · {tx.date}</div>
                                </div>
                                <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: isIn ? '#16a34a' : '#dc2626' }}>{isIn ? '+' : '-'}{fmt(tx.amount)}</div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: sBg, color: sColor, border: `1px solid ${sBorder}` }}>
                                        <SIcon size={11} />{tx.status}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Deposit */}
            {activeTab === 'deposit' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
                        <SectionHeader Icon={ArrowDownCircle} iconColor="#16a34a" iconBg="#f0fdf4" title="Deposit Funds" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div><label style={labelStyle}>Amount (USD)</label><input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} /></div>
                            <QuickAmounts vals={['500', '1000', '5000', '10000']} />
                            <div><label style={labelStyle}>Description (optional)</label><input type="text" placeholder="e.g. Wallet top-up" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} /></div>
                        </div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
                        <SectionHeader Icon={CreditCard} iconColor="#6366f1" iconBg="#f5f3ff" title="Card Details" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div><label style={labelStyle}>Card Number</label><input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} style={inputStyle} maxLength={19} /></div>
                            <div><label style={labelStyle}>Cardholder Name</label><input type="text" placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value)} style={inputStyle} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><label style={labelStyle}>Expiry</label><input type="text" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} style={inputStyle} maxLength={5} /></div>
                                <div><label style={labelStyle}>CVV</label><input type="password" placeholder="•••" value={cardCvv} onChange={e => setCardCvv(e.target.value.slice(0, 4))} style={inputStyle} maxLength={4} /></div>
                            </div>
                        </div>
                        <button onClick={() => handleSubmit('deposit')} disabled={processing || !amount} style={{ width: '100%', marginTop: '20px', padding: '13px', borderRadius: '10px', border: 'none', background: amount ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#e2e8f0', color: amount ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: '15px', cursor: amount ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {processing ? <><Clock size={16} />Processing...</> : <><ArrowDownCircle size={16} />Deposit {amount ? fmt(parseFloat(amount)) : ''}</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Withdraw */}
            {activeTab === 'withdraw' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', maxWidth: '520px' }}>
                    <SectionHeader Icon={ArrowUpCircle} iconColor="#dc2626" iconBg="#fef2f2" title="Withdraw Funds" />
                    <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Available Balance</span>
                        <span style={{ fontWeight: 700, color: '#6366f1', fontSize: '15px' }}>{fmt(walletBalance)}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={labelStyle}>Amount (USD)</label><input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} /></div>
                        <QuickAmounts vals={['500', '1000', '2000', '5000']} />
                        <div><label style={labelStyle}>Bank Account Number</label><input type="text" placeholder="IBAN or account number" value={recipient} onChange={e => setRecipient(e.target.value)} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Description (optional)</label><input type="text" placeholder="Reason for withdrawal" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} /></div>
                    </div>
                    <button onClick={() => handleSubmit('withdrawal')} disabled={processing || !amount} style={{ width: '100%', marginTop: '20px', padding: '13px', borderRadius: '10px', border: 'none', background: amount ? '#dc2626' : '#e2e8f0', color: amount ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: '15px', cursor: amount ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {processing ? <><Clock size={16} />Processing...</> : <><ArrowUpCircle size={16} />Withdraw {amount ? fmt(parseFloat(amount)) : ''}</>}
                    </button>
                </div>
            )}

            {/* Transfer */}
            {activeTab === 'transfer' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', maxWidth: '520px' }}>
                    <SectionHeader Icon={ArrowLeftRight} iconColor="#6366f1" iconBg="#f5f3ff" title="Transfer Funds" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={labelStyle}>Recipient Name or Email</label><input type="text" placeholder="e.g. Sarah Chen or sarah@nexus.com" value={recipient} onChange={e => setRecipient(e.target.value)} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Amount (USD)</label><input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} /></div>
                        <QuickAmounts vals={['100', '500', '1000', '5000']} />
                        <div><label style={labelStyle}>Note</label><input type="text" placeholder="What is this for?" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} /></div>
                    </div>
                    <button onClick={() => handleSubmit('transfer')} disabled={processing || !amount || !recipient} style={{ width: '100%', marginTop: '20px', padding: '13px', borderRadius: '10px', border: 'none', background: (amount && recipient) ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#e2e8f0', color: (amount && recipient) ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: '15px', cursor: (amount && recipient) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {processing ? <><Clock size={16} />Processing...</> : <><ArrowLeftRight size={16} />Transfer {amount ? fmt(parseFloat(amount)) : ''}</>}
                    </button>
                </div>
            )}

            {/* Fund Deal */}
            {activeTab === 'funding' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', maxWidth: '600px' }}>
                    <SectionHeader Icon={Briefcase} iconColor="#d97706" iconBg="#fffbeb" title="Fund a Deal" />
                    <p style={{ margin: '-16px 0 20px', fontSize: '13px', color: '#64748b' }}>Simulate an investor → entrepreneur funding flow</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}><Building2 size={20} color="#6366f1" /></div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#6366f1' }}>Investor</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Sends funds</div>
                        </div>
                        <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}><TrendingUp size={20} color="#16a34a" /></div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#16a34a' }}>Entrepreneur</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Receives funds</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={labelStyle}>Investor Name</label><input type="text" placeholder="e.g. James Wilson" value={recipient} onChange={e => setRecipient(e.target.value)} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Funding Amount (USD)</label><input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} /></div>
                        <QuickAmounts vals={['10000', '25000', '50000', '100000']} />
                        <div><label style={labelStyle}>Deal Description</label><input type="text" placeholder="e.g. Series A Round, Seed Funding..." value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} /></div>
                    </div>
                    {amount && recipient && (
                        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', margin: '20px 0 0', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>Transaction Summary</div>
                            {[{ label: 'From', value: recipient }, { label: 'To', value: 'Your Wallet' }, { label: 'Amount', value: fmt(parseFloat(amount)) }, { label: 'Platform Fee (2%)', value: fmt(parseFloat(amount) * 0.02) }, { label: 'You Receive', value: fmt(parseFloat(amount) * 0.98) }].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                    <span style={{ color: '#64748b' }}>{row.label}</span>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => handleSubmit('funding')} disabled={processing || !amount || !recipient} style={{ width: '100%', marginTop: '16px', padding: '13px', borderRadius: '10px', border: 'none', background: (amount && recipient) ? 'linear-gradient(135deg,#d97706,#f59e0b)' : '#e2e8f0', color: (amount && recipient) ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: '15px', cursor: (amount && recipient) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {processing ? <><Clock size={16} />Processing...</> : <><Briefcase size={16} />Confirm Funding {amount ? fmt(parseFloat(amount)) : ''}</>}
                    </button>
                </div>
            )}
        </div>
    );
};