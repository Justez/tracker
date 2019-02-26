import React from 'react';
import styled from 'styled-components';
import * as navigate from '../../utils/routes/navigators'
import * as pathName from '../../utils/routes/pathNames'

const FooterDiv = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 10vh;
    width: 100%;
    align-items: center;
    text-align: center;
    font-size: 0.7em;
    @media only screen and (max-width: 800px) {
        display: none;
    }
`;

const List = styled.ul`
    margin: 0 5% 0 5%;     
    width: 90%;
    display: flex;
`;

const ListItem = styled.li`
    text-align: center;
    width: 25%;
`;

const Footer = () => 
    <FooterDiv id="footer">
        <List>
            <ListItem tabIndex="0" onClick={navigate.toDashboard} onKeyPress={navigate.toDashboard}>{pathName.dashboard}</ListItem>
            <ListItem tabIndex="0" onClick={navigate.toApi} onKeyPress={navigate.toApi}>{pathName.api}</ListItem>
            <ListItem tabIndex="0" onClick={navigate.toAbout} onKeyPress={navigate.toAbout}>{pathName.about}</ListItem>
            <ListItem tabIndex="0" onClick={navigate.toContact} onKeyPress={navigate.toContact}>{pathName.contact}</ListItem>
        </List>
    </FooterDiv>

export default Footer;