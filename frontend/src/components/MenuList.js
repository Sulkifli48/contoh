import React from 'react';
import { 
    HomeOutlined,
    AppstoreOutlined,
    AreaChartOutlined,
    PayCircleOutlined,
    BarsOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

const MenuList = ({darkTheme}) => (
    <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar"> 
        <Menu.Item key="Home" icon={<HomeOutlined/>}>
            jadwal
        </Menu.Item>
        <Menu.SubMenu 
            key='subtasks' 
            icon={<BarsOutlined/>}
            title= "task">
                <Menu.Item key='task1'>task1</Menu.Item>
                <Menu.Item key='task2'>task2</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="Data Matkul" icon={<AppstoreOutlined/>}>
            data matkul
        </Menu.Item>
        <Menu.Item key="Data Dosen" icon={<AreaChartOutlined/>}>
            data dosen
        </Menu.Item>
        <Menu.Item key="Data Ruangan" icon={<PayCircleOutlined/>}>
            data ruangan
        </Menu.Item>
    </Menu>
    
);

export default MenuList;