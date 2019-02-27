import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    padding-top: 10vh;
    min-height: 80vh;
`;
const Title = styled.div`
    padding: 6vh 1vw 0 1vw;
    font-size: 5vh;
`;
const Content = styled.div`
    padding: 0 5vw 6vh 5vw;
    align-items: center;
    font-size: 0.8em;
    font-weight: lighter;
    display: inline-flex;
`;
const Paragraph = styled.p`
    margin-bottom: 4vh;
`;

const About = () => (
    <Wrapper>
        <Title>
            title
        </Title>
        <Content>
            <div>
                <Title>section</Title>
                <Paragraph>
                    text
                </Paragraph>
                <Paragraph>
                    text
                </Paragraph>
            </div>
        </Content>
    </Wrapper>
)

export default About