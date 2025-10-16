import HomePage from "../pages/user/HomePage/HomePage";
import FeedPage from "../pages/user/Group/FeedPage/FeedPage";
import DiscoverPage from "../pages/user/Group/DiscoverPage/DiscoverPage";
import JoinPage from "../pages/user/Group/JoinPage/JoinPage";
import DepartmentPage from "../pages/user/DepartmentPage/DepartmentPage";
import MessagePage from "../pages/user/MessagePage/MessagePage";
import NotificationPage from "../pages/user/NotificationPage/NotificationPage";

export const routes = [
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
];
