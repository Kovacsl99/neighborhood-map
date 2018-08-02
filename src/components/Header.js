import React from 'react';

const Header = () => {
    
    const click = () => document.querySelector('#sidebar').classList.toggle('sidebar-out')

    return (
        <div className="App-header">
            <i className="fas fa-bars" onClick={click}></i>
            <h1>San Francisco</h1>
        </div>
    )
}

export default Header