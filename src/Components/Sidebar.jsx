import React, { useState } from 'react';
import '../styles/Sidebar.scss';

function Sidebar({ users, onSelectUser, showAllUsers, showPendingUsers }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="sidebar">
            <button onClick={showPendingUsers}>Uživatelé čekající na schválení</button>
            <div className="dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>Shlédnutí videí</button>
                {dropdownOpen && (
                    <div className="dropdown-content">
                        <button onClick={showAllUsers}>Ukázat všechny uživatele</button>
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
