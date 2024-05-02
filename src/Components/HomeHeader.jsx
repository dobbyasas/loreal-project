import React, { useState } from "react";

import Divider from '@mui/material/Divider';
import '../styles/HomeHeader.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src="/images/conference.png" alt="Logo 1" className="logo" />
        <img src="/images/loreal.png" alt="Logo 2" className="logo" />
        <img src="/images/komora.png" alt="Logo 3" className="logo" />
        <img src="/images/jep.png" alt="Logo 4" className="logo" />
        <img src="/images/purkyne.png" alt="Logo 5" className="logo" />
        <img src="/images/sdvs.png" alt="Logo 6" className="logo" />
      </div>
      <div className="header-info">
        <h1>Informace o přidělování kreditů</h1>
        <Divider component="li" />
        <p>Vzdělávací akce je pořáídána dle Stavovského předpisu ČLK č. 16 pod číslem 112465 a bude ohodnocena 6. KREDITY. Podmínkou přidělení kreditů je zhlédnutí přednášek a odeslání registračního formuláře</p>
      </div>
      <div className="header-profile">
        <img src="/images/monika.png" alt="Prof. MUDr. Monika Arenbergerová, Ph.D." className="profile-image" />
        <div className="name-aree">
          <h2>prof. MUDr. Monika Arenbergerová, Ph.D.</h2>
          <Divider component="li" />
          <p>garant</p>
        </div>
      </div>
    </header>
  );
};

export default Header;