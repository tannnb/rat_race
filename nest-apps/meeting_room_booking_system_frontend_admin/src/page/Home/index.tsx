



import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import './home.css'


function Home() {
  const navigate = useNavigate()
  const handleClickHome = () => {
    navigate('/')
  }
  return (
    <div id="index-container">
      <div className="header">
        <h1 onClick={handleClickHome}>会议室预定系统-后台管理</h1>
        <Link to="/user/info_modify"><UserOutlined className="icon" /></Link>
      </div>
      <div className="body">
        <Outlet />
      </div>
    </div>
  )
 
}
export default Home