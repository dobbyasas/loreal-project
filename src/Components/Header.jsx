import React from "react";

import '../styles/Header.scss'

function Header() {
    return (
        <header className="small-header">
        <div className="small-header-logo">
            <img src="/images/conference.png" alt="Logo 1" className="logo" />
            <img src="/images/loreal.png" alt="Logo 2" className="logo" />
            <img src="/images/komora.png" alt="Logo 3" className="logo" />
            <img src="/images/jep.png" alt="Logo 4" className="logo" />
            <img src="/images/purkyne.png" alt="Logo 5" className="logo" />
            <img src="/images/sdvs.png" alt="Logo 6" className="logo" />
        </div>
        <button>Domů</button>
    </header>
    );
}

export default Header;
