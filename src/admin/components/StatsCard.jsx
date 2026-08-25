import React from 'react';

const StatsCard = ({ icon: Icon, value, label, color = '#4F46E5', bgColor }) => {
    const bg = bgColor || `${color}15`;

    return (
        <div className="admin-stat-card" style={{ '--stat-color': color }}>
            <div
                className="admin-stat-card-icon"
                style={{ background: bg }}
            >
                <Icon size={20} style={{ color }} />
            </div>
            <div className="admin-stat-card-value">{value ?? '—'}</div>
            <div className="admin-stat-card-label">{label}</div>
        </div>
    );
};

export default StatsCard;
