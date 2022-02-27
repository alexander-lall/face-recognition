import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'

import './logo.styles.scss';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='tilt br2 shadow-2 pa3'>
                <img alt='logo' src={brain}/>       
            </Tilt>
        </div>
    );
}

export default Logo;