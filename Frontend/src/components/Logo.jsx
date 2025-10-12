import React from 'react'
import img from '../assets/Blogging-logo.png'

function Logo({width = '30px'}) {
  return <img src={img} alt="Logo" style={{width, borderRadius: '50px'}} />;
}

export default Logo
