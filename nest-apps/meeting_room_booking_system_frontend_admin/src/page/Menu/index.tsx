import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu as AntdMenu, MenuProps } from 'antd'
import './menu.css'
import { invert } from 'lodash-es'

const items: MenuProps['items'] = [
  { key: '1', label: '会议室管理' },
  { key: '2', label: '预定管理' },
  { key: '3', label: '用户管理' },
  { key: '4', label: '统计' },
]
const pathKey: { [key: string]: string } = {
  '1': '/meeting_room_manage',
  '2': '/booking_manage',
  '3': '/user_manage',
  '4': '/statistics',
}
const Menu: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  function getSelectKeys() {
    const key = invert(pathKey)[location.pathname] || '1'
    return [key]
  }

  const handleMenuItemClick: MenuProps['onClick'] = (info: { key: string }) => {
    navigate(pathKey[info.key])
  }
  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          items={items}
          defaultSelectedKeys={getSelectKeys()}
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
