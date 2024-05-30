import React, { useState } from 'react';
import '../styles/Sidebar.scss';

function Sidebar({ users, onSelectUser, showPendingUsers }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="sidebar">
            <button onClick={showPendingUsers}>Pending Users</button>
            <div className="dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>Registered Users</button>
                {dropdownOpen && (
                    <div className="dropdown-content">
                        {users.map(user => (
                            <button key={user.id} onClick={() => onSelectUser(user)}>
                                {user.name} {user.surname}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
