import React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import SidebarGroupLayout from "./layouts/user/SidebarGroupLayout";
import SidebarLayout from "./layouts/user/SidebarLayout";

function App() {
  return (
    <>
      <Routes>
        {routes.map((route, index) => {
          const Page = route.page;

          let Layout = React.Fragment;

          if (route.isShowSidebarGroupUser && route.isShowSidebarUser) {
            Layout = SidebarGroupLayout;
          } else if (route.isShowSidebarUser) {
            Layout = SidebarLayout;
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
