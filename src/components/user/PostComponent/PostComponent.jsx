import React, { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosStar, IoMdLock } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { PiChatCenteredDotsLight, PiShareLight } from "react-icons/pi";
import TextCollapse from "../TextCollapse/TextCollapse";
import MediaLayout from "../MediaLayout/MediaLayout";
import FileItem from "../FileItem/FileItem";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { formatVietnamTime } from "../../../utils/formatVietnamTime";
import { FaUserFriends } from "react-icons/fa";
import { GiEarthAmerica } from "react-icons/gi";

const PostComponent = ({ postsList }) => {
  const [heartedPosts, setHeartedPosts] = useState({});
  const [posts, setPosts] = useState(postsList || []);

  useEffect(() => {
    setPosts(postsList || []);
  }, [postsList]);

  const handleHeartPost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isHearted = heartedPosts[postId] || false;
          const newHeart = isHearted ? post.heart - 1 : post.heart + 1;
          return { ...post, heart: newHeart };
        }
        return post;
      })
    );

    setHeartedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <>
      {posts.map((item) => (
        <div
          key={item._id}
          className="p-4 my-3 shadow rounded-md dark:bg-[#252728]"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                {item.group && (
                  <div className="w-10 h-10 overflow-hidden rounded-sm bg-white">
                    <img
                      className="w-full h-full"
                      src={item.group.groupAvatar}
                      alt="groupAvatar"
                    />
                  </div>
                )}

                <div
                  className={`${
                    item.group?.groupAvatar
                      ? "absolute top-2 left-2 border-3 dark:border-black border-white"
                      : ""
                  } w-10 h-10 rounded-full bg-white overflow-hidden`}
                >
                  <img
                    className="w-full h-full"
                    src={item.author.userAvatar || LogoCTUT}
                    alt="authorAvatar"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col">
                {item.group ? (
                  <>
                    <div>{item.group.groupName}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <div>{item.author.firstName}</div>
                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                      <div>{formatVietnamTime(item.createdAt)}</div>
                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                      <div>
                        {item.privacy === "public" ? (
                          <div className="relative group flex items-center justify-center">
                            <GiEarthAmerica className="text-gray-600 text-lg" />
                            <div
                              className="absolute bottom-full mb-1 px-2 py-1 rounded-md text-xs 
                              text-white bg-gray-700
      opacity-0 group-hover:opacity-100 transition-opacity duration-1000 whitespace-nowrap"
                            >
                              Công khai
                            </div>
                          </div>
                        ) : item.privacy === "friends" ? (
                          <div className="relative group flex items-center justify-center">
                            <FaUserFriends className="text-gray-600 text-lg" />
                            <div
                              className="absolute bottom-full mb-1 px-2 py-1 rounded-md text-xs 
                              text-white bg-gray-700
      opacity-0 group-hover:opacity-100 transition-opacity duration-1000 whitespace-nowrap"
                            >
                              Bạn bè
                            </div>
                          </div>
                        ) : (
                          <div className="relative group flex items-center justify-center">
                            <IoMdLock className="text-gray-600 text-lg" />
                            <div
                              className="absolute bottom-full mb-1 px-2 py-1 rounded-md text-xs 
                              text-white bg-gray-700
      opacity-0 group-hover:opacity-100 transition-opacity duration-1000 whitespace-nowrap"
                            >
                              Chỉ mình tôi
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 items-center">
                      <div>
                        {item.author.lastName} {item.author.firstName}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <div>{formatVietnamTime(item.createdAt)}</div>
                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                      <div>
                        {item.privacy === "public" ? (
                          <div className="relative group flex items-center justify-center">
                            <GiEarthAmerica className="text-gray-600 text-lg" />
                            <div
                              className="absolute bottom-full mb-1 px-2 py-1 rounded-md text-xs 
                              text-white bg-gray-700
      opacity-0 group-hover:opacity-100 transition-opacity duration-1000 whitespace-nowrap"
                            >
                              Công khai
                            </div>
                          </div>
                        ) : item.privacy === "friends" ? (
                          <div className="relative group flex items-center justify-center">
                            <FaUserFriends className="text-gray-600 text-lg" />
                            <div
                              className="absolute bottom-full mb-1 px-2 py-1 rounded-md text-xs 
                              text-white bg-gray-700
      opacity-0 group-hover:opacity-100 transition-opacity duration-1000 whitespace-nowrap"
                            >
                              Bạn bè
                            </div>
                          </div>
                        ) : (
                          <div className="relative group flex items-center justify-center">
                            <IoMdLock className="text-gray-600 text-lg" />
                            <div
                              className="absolute bottom-full mb-1 px-2 py-1 rounded-md text-xs 
                              text-white bg-gray-700
      opacity-0 group-hover:opacity-100 transition-opacity duration-1000 whitespace-nowrap"
                            >
                              Chỉ mình tôi
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Menu */}
            <div className="flex gap-3 items-center">
              {!item.group && (
                <div className="flex justify-center items-center w-6 h-6 text-blue-600">
                  <IoIosStar size={18} />
                </div>
              )}
              <HiOutlineDotsHorizontal className="w-6 h-6" size={18} />
            </div>
          </div>

          {/* CONTENT */}
          <TextCollapse text={item.content} bgColor={item.bgContent || ""} />

          {/* HASHTAGS */}
          <div className="flex flex-wrap gap-2 mt-2 text-blue-500 text-sm">
            {item.hashtag?.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>

          {/* EMOTION */}
          {item.emotion && (
            <div className="flex items-center gap-1 my-2 text-sm text-gray-600">
              <BsDashLg />
              <span>đang cảm thấy {item.emotion}.</span>
            </div>
          )}

          {/* FILES */}
          <div className="my-4 flex flex-col gap-2">
            {item.documents?.map((f, i) => (
              <FileItem key={i} file={f} />
            ))}
          </div>

          {/* MEDIA */}
          <MediaLayout medias={item.medias} />

          {/* ACTIONS */}
          <div className="flex justify-around items-center text-2xl pt-4 mt-6 border-t border-gray-300 dark:border-0">
            <button
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => handleHeartPost(item.id)}
            >
              {heartedPosts[item.id] ? (
                <IoHeartSharp className="text-red-500 transition" />
              ) : (
                <IoHeartOutline className="transition" />
              )}
              <div className="text-[16px]">{item.heart}</div>
            </button>

            <button className="flex gap-2 items-center cursor-pointer">
              <PiChatCenteredDotsLight />
              <div className="text-[16px]">{item.comment}</div>
            </button>

            <button className="flex gap-2 items-center cursor-pointer">
              <PiShareLight />
              <div className="text-[16px]">{item.share}</div>
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostComponent;
