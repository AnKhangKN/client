import HomePage from "../pages/user/HomePage/HomePage";
import FeedPage from "../pages/user/Group/FeedPage/FeedPage";
import DiscoverPage from "../pages/user/Group/DiscoverPage/DiscoverPage";
import JoinPage from "../pages/user/Group/JoinPage/JoinPage";
import DepartmentPage from "../pages/user/DepartmentPage/DepartmentPage";
import MessagePage from "../pages/user/MessagePage/MessagePage";
import NotificationPage from "../pages/user/NotificationPage/NotificationPage";
import ProfilePage from "../pages/user/ProfilePage/ProfilePage";
import LoginPage from "../pages/auth/LoginPage/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage/RegisterPage";
import DashboardPage from "../pages/admin/DashboardPage/DashboardPage";
import GroupManagementPage from "../pages/admin/GroupManagementPage/GroupManagementPage";
import DepartmentManagementPage from "../pages/admin/DepartmentManagementPage/DepartmentManagementPage";
import MessageManagementPage from "../pages/admin/MessageMamagementPage/MessageManagementPage";

export const routes = [
  // auth
  {
    path: "/login",
    page: LoginPage,
  },
  {
    path: "/register",
    page: RegisterPage,
  },

  // user
  {
    path: "/",
    page: HomePage,
    isShowSidebarUser: true,
  },
  {
    path: "/groups/feed",
    page: FeedPage,
    isShowSidebarUser: true,
    isShowSidebarGroupUser: true,
  },
  {
    path: "/groups/discover",
    page: DiscoverPage,
    isShowSidebarUser: true,
    isShowSidebarGroupUser: true,
  },
  {
    path: "/groups/join",
    page: JoinPage,
    isShowSidebarUser: true,
    isShowSidebarGroupUser: true,
  },
  {
    path: "/department",
    page: DepartmentPage,
    isShowSidebarUser: true,
  },
  {
    path: "/message",
    page: MessagePage,
    isShowSidebarUser: true,
  },
  {
    path: "/notification",
    page: NotificationPage,
    isShowSidebarUser: true,
  },
  {
    path: "/profile",
    page: ProfilePage,
    isShowSidebarUser: true,
  },

  // admin
  {
    path: "/admin",
    page: DashboardPage,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/groups",
    page: GroupManagementPage,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/department",
    page: DepartmentManagementPage,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/message",
    page: MessageManagementPage,
    isShowSidebarAdmin: true,
  },
];
