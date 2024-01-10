import { Outlet } from 'react-router-dom'
import { Menu as AntdMenu, MenuProps } from 'antd'
import './menu.css'
import { Link, useNavigate,useLocation } from 'react-router-dom'

const items: MenuProps['items'] = [
  { key: '1', label: '信息修改' },
  { key: '2', label: '密码修改' },
]
const Menu: React.FC = () => {
  const navigator = useNavigate()
  const location = useLocation()
  const defaultKey = location.pathname === '/user/info_modify' ? ['1']:['2']

  const handleMenuItemClick: MenuProps['onClick'] = (info) => {
    if (info.key === '1') {
      navigator('/user/info_modify')
    } else if (info.key === '2') {
      navigator('/user/password_modify')
    }
  }
  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          items={items}
          defaultSelectedKeys={defaultKey}
          onClick={handleMenuItemClick}
        ></AntdMenu>
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Menu
