import React from "react";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";
import BottomNavbarComponent from "../../components/user/BottomNavbarComponent/BottomNavbarComponent";
import SidebarGroupComponent from "../../components/user/SidebarGroupComponent/SidebarGroupComponent";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { useEffect } from "react";
import { updateOnlineFriends } from "../../features/onlineFriends/onlineFriends";

const SidebarLayoutUser = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("setup", user.id);

    socket.on("onlineFriends", (friends) => {
      // console.log("✅ Mutual friends online:", friends);

      dispatch(updateOnlineFriends({ onlineFriends: friends }));
    });

    return () => {
      socket.off("onlineFriends");
    };
  }, [user.id]);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />

      <main className="flex-1 overflow-y-auto">{children}</main>

      {location.pathname === "/groups/feed" ||
      location.pathname === "/groups/discover" ||
      location.pathname === "/groups/join" ? (
        <SidebarGroupComponent />
      ) : null}

      <BottomNavbarComponent />
    </div>
  );
};

export default SidebarLayoutUser;
