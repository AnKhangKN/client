import HomePage from "../pages/user/HomePage/HomePage";
import FeedPage from "../pages/user/Group/FeedPage/FeedPage";
import DiscoverPage from "../pages/user/Group/DiscoverPage/DiscoverPage";
import MessagePage from "../pages/user/MessagePage/MessagePage";
import NotificationPage from "../pages/user/NotificationPage/NotificationPage";
import ProfilePage from "../pages/user/ProfilePage/ProfilePage";
import LoginPage from "../pages/auth/LoginPage/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage/RegisterPage";
import DashboardPage from "../pages/admin/DashboardPage/DashboardPage";
import GroupManagementPage from "../pages/admin/GroupManagementPage/GroupManagementPage";
import DepartmentManagementPage from "../pages/admin/DepartmentManagementPage/DepartmentManagementPage";
import MessageManagementPage from "../pages/admin/MessageManagementPage/MessageManagementPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import UserManagementPage from "../pages/admin/UserManagementPage/UserManagementPage";
import NotificationPageAdmin from "../pages/admin/NotificationPage/NotificationPage";
import ProfilePageAdmin from "../pages/admin/ProfilePage/ProfilePage";
import EditProfilePage from "../pages/admin/EditProfilePage/EditProfilePage";
import SecurityAdminPage from "../pages/admin/SecurityPage/SecurityPage";
import PostManagementPage from "../pages/admin/PostManagementPage/PostManagementPage";
import FeedDePartmentPage from "../pages/user/Department/FeedPage/FeedPage";
import CreateGroupPage from "../pages/user/Group/CreateGroupPage/CreateGroupPage";
import PostDetail from "../pages/user/PostDetail/PostDetail";
import EditPage from "../pages/user/EditPage/EditPage";
import BlockedAccounts from "../pages/user/BlockedAccounts/BlockedAccounts";
import DeleteAccount from "../pages/user/DeleteAccount/DeleteAccount";
import ActivitiesPage from "../pages/user/ActivitiesPage/ActivitiesPage";
import QrPage from "../pages/user/QrPage/QrPage";
import SecurityPage from "../pages/user/SecurityPage/SecurityPage";
import DepartmentDetailPage from "../pages/user/Department/DepartmentDetailPage/DepartmentDetailPage";
import PostManagementDetailPage from "@/pages/admin/PostManagementDetailPage/PostManagementDetailPage";
import GroupDetailPage from "@/pages/user/Group/GroupDetailPage/GroupDetailPage";
import GroupDetailMember from "@/pages/user/Group/GroupDetailMember/GroupDetailMember";
import DiscoverDepartMentPage from "@/pages/user/Department/DiscoverPage/DiscoverPage";

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
  {
    path: "/forgot-password",
    page: ForgotPasswordPage,
  },

  // user
  {
    path: "/",
    page: HomePage,
    isShowSidebarUser: true,
  },
  {
    path: "/post/:postId",
    page: PostDetail,
    isShowSidebarUser: true,
  },
  {
    path: "/groups/feed",
    page: FeedPage,
    isShowSidebarUser: true,
  },
  {
    path: "/groups/discover",
    page: DiscoverPage,
    isShowSidebarUser: true,
  },
  {
    path: "/groups/public/:groupName/:groupId",
    page: GroupDetailPage,
  },
  {
    path: "/groups/members/:groupName/:groupId",
    page: GroupDetailMember,
  },
  {
    path: "/groups/create",
    page: CreateGroupPage,
  },
  {
    path: "/department/feed",
    page: FeedDePartmentPage,
    isShowSidebarUser: true,
  },
  {
    path: "/department/feed/:departmentName/:departmentId",
    page: DepartmentDetailPage,
    isShowSidebarUser: true,
  },
  {
    path: "/department/discover",
    page: DiscoverDepartMentPage,
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
    path: "/profile/:userName",
    page: ProfilePage,
    isShowSidebarUser: true,
  },
  {
    path: "/qr",
    page: QrPage,
  },
  {
    path: "/accounts/edit",
    page: EditPage,
    isShowSidebarUser: true,
  },
  {
    path: "/accounts/blocked_accounts",
    page: BlockedAccounts,
    isShowSidebarUser: true,
  },
  {
    path: "/accounts/activities",
    page: ActivitiesPage,
    isShowSidebarUser: true,
  },
  {
    path: "/accounts/security",
    page: SecurityPage,
    isShowSidebarUser: true,
  },
  {
    path: "/accounts/delete_account",
    page: DeleteAccount,
    isShowSidebarUser: true,
  },

  // admin
  {
    path: "/admin",
    page: DashboardPage,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/user",
    page: UserManagementPage,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/posts",
    page: PostManagementPage,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/posts/:detailName",
    page: PostManagementDetailPage,
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
  {
    path: "/admin/notification",
    page: NotificationPageAdmin,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/profile",
    page: ProfilePageAdmin,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/profile/edit",
    page: EditProfilePage,
    isShowSidebarAdmin: true,
  },
  {
    path: "/admin/profile/security",
    page: SecurityAdminPage,
    isShowSidebarAdmin: true,
  },

  // Not found page
  { path: "*", page: NotFoundPage },
];
