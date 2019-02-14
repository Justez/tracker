import React from 'react';
import * as navigate from '../../utils/routes/navigators'
import * as pathName from '../../utils/routes/pathNames'

const Footer = () => 
    <div className="footer">
        <ul>
            <li tabIndex="0" onClick={navigate.toDashboard} onKeyPress={navigate.toDashboard}>{pathName.dashboard}</li>
            <li tabIndex="0" onClick={navigate.toApi} onKeyPress={navigate.toApi}>{pathName.api}</li>
            <li tabIndex="0" onClick={navigate.toAbout} onKeyPress={navigate.toAbout}>{pathName.about}</li>
            <li tabIndex="0" onClick={navigate.toContact} onKeyPress={navigate.toContact}>{pathName.contact}</li>
        </ul>
    </div>

export default Footer;