import React from 'react';
import '../styles/Sidebar.scss';

function Sidebar({ users, onSelectUser, showPendingUsers }) {
    return (
        <div className="sidebar">
            <button onClick={showPendingUsers}>Pending Users</button>
            <div className="dropdown">
                <button className="dropdown-btn">Registered Users</button>
                <div className="dropdown-content">
                    {users.map(user => (
                        <button key={user.id} onClick={() => onSelectUser(user)}>
                            {user.email}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
