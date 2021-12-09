import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Layout} from 'antd';
import 'antd/dist/antd.css';

function FooterView() 
{
    const { Footer } = Layout;

    return(<Footer style={{ textAlign: 'center' }}>©<>{new Date().getFullYear()}</> Solution by BFF EAG Team</Footer>);
}

export default FooterView;

