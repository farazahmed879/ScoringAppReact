import React from 'react';
import { Link } from 'react-router-dom';
import AbpLogo from '../../images/scoreexec.png';
export default function Header(props) {
  return (
    <header {...props} id="header" style={{display: 'flex', justifyContent: 'space-between'}}>
      <Link to={'/'} id="logo">
        <img alt="logo" src={AbpLogo} />
        {/* <img alt="Ant Design" src="https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg" /> */}
      </Link>
      <Link to={'/user/login'}>Login</Link>
    </header>
  );
}
