import React from 'react';
import { connect } from 'react-redux';
import { registerViewAction } from '../../redux/actions/sessionActions';
import styled from 'styled-components';
import * as path from '../../utils/routes/paths';
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


const Footer = (props) => {
    const { registerView } = props;
    
    return (
        <FooterDiv id="footer">
            <List>
                <ListItem tabIndex="0" onClick={() => registerView(path.dashboardPath)} onKeyPress={() => registerView(path.dashboardPath)}>{pathName.dashboard}</ListItem>
                <ListItem tabIndex="0" onClick={() => registerView(path.apiPath)} onKeyPress={() => registerView(path.apiPath)}>{pathName.api}</ListItem>
                <ListItem tabIndex="0" onClick={() => registerView(path.aboutPath)} onKeyPress={() => registerView(path.aboutPath)}>{pathName.about}</ListItem>
                <ListItem tabIndex="0" onClick={() => registerView(path.contactPath)} onKeyPress={() => registerView(path.contactPath)}>{pathName.contact}</ListItem>
            </List>
        </FooterDiv>
    )
}

const mapDispatchToProps = (dispatch) => ({
    registerView: (name) => dispatch(registerViewAction(name)),
});

export default connect(undefined, mapDispatchToProps)(Footer);