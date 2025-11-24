import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { routes } from "./routes";
import SidebarLayoutUser from "./layouts/user/SidebarLayoutUser";
import SidebarLayoutAdmin from "./layouts/admin/SidebarLayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import * as UserServices from "./services/shared/UserServices";
import { updateUser } from "./features/user/userSlice";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import * as TokenUtils from "./utils/token.utils";
import LoadingComponent from "./components/shared/LoadingComponent/LoadingComponent";
import { socket } from "./utils/socket";
import { updateOnlineFriends } from "./features/onlineFriends/onlineFriends";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  useEffect(() => {
    const initApp = async () => {
      const accessToken = await TokenUtils.getValidAccessToken();
      const currentPath = window.location.pathname;

      // Các route công khai
      const publicPaths = ["/login", "/register", "/forgot-password"];
      const firstVisitPaths = ["/", ...publicPaths]; // những đường dẫn "lần đầu mở app"

      if (!accessToken) {
        if (!publicPaths.includes(currentPath)) {
          navigate("/login");
        }
        setIsLoading(false);
        return;
      }

      try {
        const res = await UserServices.getDetailUser(accessToken);
        if (res?.user) {
          dispatch(updateUser(res.user));

          // Chỉ redirect lần đầu khi mở app
          if (firstVisitPaths.includes(currentPath)) {
            if (res.user.isAdmin) {
              navigate("/admin");
            } else {
              navigate("/"); // user thường
            }
          }
        } else {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
        localStorage.removeItem("accessToken");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    socket.emit("setup", user.id);

    socket.on("onlineFriends", (friends) => {

      dispatch(updateOnlineFriends({ onlineFriends: friends }));
    });

    return () => {
      socket.off("onlineFriends");
    };
  }, [user.id, dispatch]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Routes>
      {routes.map((route, index) => {
        const Page = route.page;

        let Layout = React.Fragment;

        if (route.isShowSidebarUser) {
          Layout = SidebarLayoutUser;
        } else if (route.isShowSidebarAdmin) {
          Layout = SidebarLayoutAdmin;
        }

        const checkAuth =
          !route.isShowSidebarAdmin ||
          (route.isShowSidebarAdmin && user?.isAdmin);

        return (
          <Route
            key={index}
            path={route.path}
            element={
              checkAuth ? (
                <Layout>
                  <Page />
                </Layout>
              ) : (
                <NotFoundPage />
              )
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
