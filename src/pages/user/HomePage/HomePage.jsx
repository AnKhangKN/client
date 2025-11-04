import React, { useEffect, useState } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import ChatBoxComponent from "../../../components/user/ChatBoxComponent/ChatBoxComponent";
import HeaderComponent from "../../../components/user/HeaderComponent/HeaderComponent";
import ActiveFriendsListAndGroupsListComponent from "../../../components/user/ActiveFriendsListAndGroupsComponent/ActiveFriendsListAndGroupsComponent";
import PostComponent from "../../../components/user/Post/PostComponent/PostComponent";
import PostCreateComponent from "../../../components/user/PostCreateComponent/PostCreateComponent";
import * as ValidateToken from "../../../utils/token.utils";
import * as PostServices from "../../../services/user/PostServices";
import FriendsSuggestComponent from "../../../components/user/FriendsSuggestComponent.jsx/FriendsSuggestComponent";
import * as UserServices from "../../../services/user/UserServices";
import { useSelector } from "react-redux";

const HomePage = () => {
  const listGroup = [
    { id: "1", groupAvatar: LogoCTUT, groupName: "Web" },
    { id: "2", groupAvatar: LogoCTUT, groupName: "Web" },
    { id: "3", groupAvatar: LogoCTUT, groupName: "Web" },
  ];

  const [posts, setPosts] = useState([]);
  const firstFivePosts = posts.slice(0, 1);
  const remainingPosts = posts.slice(1);

  const [friendsSuggest, setFriendsSuggest] = useState([]);
  const online = useSelector((state) => state.online || []);

  const fetchPosts = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await PostServices.getPosts(accessToken);
      setPosts(res.posts);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const fetchFriendsSuggest = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await UserServices.getFriendSuggest(accessToken);

      setFriendsSuggest(res.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFriendsSuggest();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#1c1c1d] dark:text-white relative">
      <HeaderComponent />

      {/* content ----- scrollbar-hide  */}
      <div className="flex lg:pl-2 lg:pr-[326px] w-full pt-10 flex-col items-center overflow-y-auto">
        <div className="w-11/12 max-w-[600px] space-y-4">
          <PostCreateComponent />

          {/* Hiển thị 5 bài đầu */}
          <PostComponent postsList={firstFivePosts} />

          {/* Gợi ý bạn bè */}
          <div className={`${friendsSuggest?.length ? "block" : "hidden"}`}>
            {posts.length > 1 && (
              <FriendsSuggestComponent friendsSuggest={friendsSuggest} />
            )}
          </div>

          {/* Hiển thị các bài viết còn lại */}
          <PostComponent postsList={remainingPosts} />
        </div>
      </div>

      {/* friends list and groups list */}
      <div
        className="absolute right-1 top-5 border border-gray-200 rounded-lg bottom-2 flex-col me-4 my-4 px-2 
        overflow-y-auto w-[320px] shadow lg:flex hidden scrollbar-hide"
      >
        <ActiveFriendsListAndGroupsListComponent
          activeFriendsList={online.onlineFriends}
          groupsList={listGroup}
        />
      </div>

      <div className="fixed z-50 lg:hidden block bottom-12 right-5">
        <ChatBoxComponent
          listFriends={online.onlineFriends}
          listGroups={listGroup}
        />
      </div>
    </div>
  );
};

export default HomePage;
