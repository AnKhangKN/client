import React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import SidebarGroupLayoutUser from "./layouts/user/SidebarGroupLayoutUser";
import SidebarLayoutUser from "./layouts/user/SidebarLayoutUser";
import SidebarLayoutAdmin from "./layouts/admin/SidebarLayoutAdmin";

function App() {
  return (
    <>
      <Routes>
        {routes.map((route, index) => {
          const Page = route.page;

          let Layout = React.Fragment;

          if (route.isShowSidebarGroupUser && route.isShowSidebarUser) {
            Layout = SidebarGroupLayoutUser;
          } else if (route.isShowSidebarUser) {
            Layout = SidebarLayoutUser;
          } else if (route.isShowSidebarAdmin) {
            Layout = SidebarLayoutAdmin;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        <Route></Route>
      </Routes>
    </>
  );
}

export default App;
