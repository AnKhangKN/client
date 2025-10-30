import React, { useEffect, useRef, useState } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import ChatBoxComponent from "../../../components/user/ChatBoxComponent/ChatBoxComponent";
import HeaderComponent from "../../../components/user/HeaderComponent/HeaderComponent";
import useClickOutside from "../../../hooks/useClickOutside";
import ActiveFriendsListAndGroupsListComponent from "../../../components/user/ActiveFriendsListAndGroupsComponent/ActiveFriendsListAndGroupsComponent";
import PostComponent from "../../../components/user/PostComponent/PostComponent";
import PostCreateComponent from "../../../components/user/PostCreateComponent/PostCreateComponent";
import * as ValidateToken from "../../../utils/token.utils";
import * as PostServices from "../../../services/user/PostServices";
import FriendsSuggestComponent from "../../../components/user/FriendsSuggestComponent.jsx/FriendsSuggestComponent";
import * as UserServices from "../../../services/user/UserServices";

const HomePage = () => {
  const listActiveFriends = [
    {
      id: "1",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "2",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "3",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "4",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "5",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "7",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "8",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "9",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "10",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "11",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "12",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "13",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
    {
      id: "14",
      userAvatar: LogoCTUT,
      userName: "Khang",
    },
  ];

  const listGroup = [
    { id: "1", groupAvatar: LogoCTUT, groupName: "Web" },
    { id: "2", groupAvatar: LogoCTUT, groupName: "Web" },
    { id: "3", groupAvatar: LogoCTUT, groupName: "Web" },
  ];

  const [posts, setPosts] = useState([]);
  const firstFivePosts = posts.slice(0, 1);
  const remainingPosts = posts.slice(1);

  const [modalNewPost, setModelNewPost] = useState(false);
  const [friendsSuggest, setFriendsSuggest] = useState([]);
  const newPostRef = useRef(null);

  useClickOutside(newPostRef, modalNewPost, () => setModelNewPost(false));

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
    <div className="flex h-screen overflow-hidden dark:bg-[#1c1c1d] dark:text-white">
      <HeaderComponent />

      {/* content */}
      <div className="flex md:py-4 pt-18 flex-col items-center w-full overflow-y-auto scrollbar-hide">
        {/* add new post */}
        <PostCreateComponent />

        <div className="w-11/12 max-w-[600px] space-y-4">
          {/* Hiển thị 5 bài đầu */}
          <PostComponent postsList={firstFivePosts} />

          {/* Gợi ý bạn bè */}
          {posts.length > 1 && (
            <FriendsSuggestComponent friendsSuggest={friendsSuggest} />
          )}

          {/* Hiển thị các bài viết còn lại */}
          <PostComponent postsList={remainingPosts} />
        </div>
      </div>

      {/* friends list and groups list */}
      <div
        className="flex-col me-4 my-4 px-2 overflow-y-auto w-[380px] shadow lg:flex hidden 
      scrollbar-hide"
      >
        <ActiveFriendsListAndGroupsListComponent
          activeFriendsList={listActiveFriends}
          groupsList={listGroup}
        />
      </div>

      <div className="fixed lg:hidden block bottom-8 right-8">
        <ChatBoxComponent
          listFriends={listActiveFriends}
          listGroups={listGroup}
        />
      </div>
    </div>
  );
};

export default HomePage;
