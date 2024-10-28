import React, { useState } from 'react';
import{Button, Layout, theme} from 'antd';
import Logo from './Logo';
import MenuList from './MenuList';
import ToggleThemeButton from './ToogleThemeButton';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import "../pages/css/Admin.css"

const {Header, Sider} = Layout;
function Sidebar(){
    const[darkTheme, setDarkTheme] = useState(true)
    const[collapsed, setCollapsed] = useState(false)

    const toggleTheme = ()=>{
        setDarkTheme (!darkTheme)
    }

    const{
        token: {colorBgContainer},

    }= theme.useToken();

    return (
        <Layout className="sidebar-container">
            <Sider collapsed={collapsed} 
                collapsible 
                trigger={null} 
                theme={darkTheme? 'dark' : 'light'} 
                className='sidebar'
            >
            <Logo/>
            <MenuList darkTheme={darkTheme} />
            <ToggleThemeButton darkTheme={darkTheme}
            toggleTheme={toggleTheme}/>
            </Sider>
            <Layout className="content-layout">
                <Header style={{padding:0, background:colorBgContainer}}>
                    <Button 
                        type='text' 
                        className='toggle' 
                        onClick={()=> setCollapsed(!collapsed)} 
                        icon={collapsed ? <MenuUnfoldOutlined /> : 
                        <MenuFoldOutlined /> } 
                    />
                </Header>
            </Layout>
        </Layout>
    )
}
export default Sidebar;