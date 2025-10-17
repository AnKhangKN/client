import React, { useState } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { ImImages } from "react-icons/im";
import { BsDashLg, BsEmojiWinkFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { VscComment } from "react-icons/vsc";
import { PiShareFatLight } from "react-icons/pi";
import { RiSearchLine } from "react-icons/ri";
import ChatBoxComponent from "../../../components/user/ChatBoxComponent/ChatBoxComponent";
import TextCollapse from "../../../components/user/TextCollapse/TextCollapse";
import HeaderComponent from "../../../components/user/HeaderComponent/HeaderComponent";

const HomePage = () => {
  const [heartedPosts, setHeartedPosts] = useState({});

  const listPost = [
    {
      id: "1",
      userAvatar: LogoCTUT,
      userName: "Khang",
      createAt: "13/10/2024 6H30",
      content: "Nội dung bài post với 2",
      hashtag: ["#CongNgheThongTin"],
      emotion: "vui",
      images: [LogoCTUT, LogoCTUT],
      heart: 300,
      comment: 45,
      share: 10,
    },
    {
      id: "2",
      userAvatar: LogoCTUT,
      userName: "Khang nè",
      createAt: "13/10/2024 6H30",
      content:
        "Nội dung bài post quá dài gồm 3 ảnh (nội dung dài quá thể có thể hơn 2 dòng, nếu nội dung bài viết quá dài hơn 2 dòng sẽ hiện ... ở dưới sẽ hiện xem thêm khi click vào xem thêm sẽ hiện full bài post gồm tất cả nội dung của bài viết người xem có thể xem toàn bộ bài viết trên hoạt ảnh cũng sẽ chen lên các nội dung khiến bài post dài ra hơn bình thường).",
      hashtag: ["#CongNgheThongTin", "#CTUT"],
      emotion: "buồn",
      images: [LogoCTUT, LogoCTUT, LogoCTUT],
      heart: 300,
      comment: 45,
      share: 10,
    },
    {
      id: "3",
      userAvatar: LogoCTUT,
      userName: "Khang",
      createAt: "13/10/2024 6H30",
      content: "Nội dung bài post với 1 ảnh",
      hashtag: ["#CongNgheThongTin", "#CTUT", "#HeThongThongTin"],
      emotion: "buồn",
      images: [LogoCTUT],
      heart: 300,
      comment: 45,
      share: 10,
    },
    {
      id: "4",
      userAvatar: LogoCTUT,
      userName: "Khang",
      createAt: "13/10/2024 6H30",
      content: "Nội dung bài post trên 3 ảnh",
      hashtag: ["#CongNgheThongTin"],
      emotion: "buồn",
      images: [LogoCTUT, LogoCTUT, LogoCTUT, LogoCTUT],
      heart: 300,
      comment: 45,
      share: 10,
    },
  ];

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

  const [posts, setPosts] = useState(listPost);

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
    <div className="flex h-screen overflow-hidden">
      <HeaderComponent />

      {/* content */}
      <div className="flex md:py-4 pt-18 flex-col items-center w-full overflow-y-auto scrollbar-hide">
        {/* add new post */}
        <div className="px-4 mb-2 w-11/12 max-w-[600px] shadow bg-white">
          <div className="flex gap-2 py-4">
            <img className="w-10 rounded-full" src={LogoCTUT} alt="" />

            <div className="w-full bg-gray-100 px-4 rounded-full text-gray-500 flex items-center justify-start">
              Khang ơi, đang nghĩ gì thế!
            </div>
          </div>

          <div className="flex py-2 justify-around items-center border-t border-gray-300">
            <div className="flex justify-center cursor-pointer gap-2 px-4 py-3 items-center hover:bg-gray-200">
              <div className="flex justify-center items-center text-xl">
                <ImImages />
              </div>
              <div>Ảnh/Video</div>
            </div>

            <div className="flex justify-center cursor-pointer gap-2 px-4 py-3 items-center hover:bg-gray-200">
              <div className="flex justify-center items-center text-xl">
                <BsEmojiWinkFill />
              </div>
              <div>Cảm xúc của bạn!</div>
            </div>
          </div>
        </div>

        {/* new post */}
        {posts.map((item) => (
          <div
            key={item.id}
            className="p-4 my-2 w-11/12 max-w-[600px] shadow bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img className="w-10 h-10" src={item.userAvatar} alt="" />
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <div>{item.userName}</div>
                    <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                    <div className="text-blue-600">Theo dõi</div>
                  </div>
                  <div className="text-sm text-gray-500">{item.createAt}</div>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex justify-center items-center w-6 h-6">
                  <HiOutlineDotsHorizontal />
                </div>
                <div className="flex justify-center items-center  w-6 h-6">
                  <MdOutlineClose />
                </div>
              </div>
            </div>

            {/* content */}
            <TextCollapse text={item.content} />

            {/* hashtag */}
            <div className="flex flex-wrap gap-2 mt-2 text-blue-500 text-sm">
              {item.hashtag.map((tag, i) => (
                <span key={i}>{tag}</span>
              ))}
            </div>

            {/* emotion */}
            <div className="flex items-center gap-1 my-2 text-sm text-gray-600">
              <BsDashLg />
              <span>đang cảm thấy {item.emotion}.</span>
            </div>

            {/* picture */}
            {(() => {
              const images = item.images;

              if (images.length === 1) {
                return (
                  <div className="max-h-[590px] overflow-hidden">
                    <img
                      className="w-full h-full rounded-lg object-cover"
                      src={images[0]}
                      alt="image"
                    />
                  </div>
                );
              } else if (images.length === 2) {
                return (
                  <div className="grid grid-cols-2 gap-2 max-h-[590px] overflow-hidden">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        className="w-full h-full rounded-lg object-cover"
                        src={img}
                        alt={`image-${index}`}
                      />
                    ))}
                  </div>
                );
              } else {
                // ≥ 3 ảnh
                return (
                  <div className="grid grid-cols-3 gap-2 max-h-[590px] overflow-hidden">
                    {/* Ảnh lớn bên trái */}
                    <div className="col-span-2">
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        src={images[0]}
                        alt="main"
                      />
                    </div>

                    {/* Hai ảnh nhỏ bên phải (xếp dọc) */}
                    <div className="grid grid-rows-2 gap-2">
                      {images.slice(1, 3).map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            className="w-full h-full object-cover rounded-lg"
                            src={img}
                            alt={`image-${index + 1}`}
                          />

                          {/* Nếu là ảnh cuối cùng trong phần hiển thị và vẫn còn ảnh dư */}
                          {index === 1 && images.length > 3 && (
                            <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                              <span className="text-white text-2xl font-semibold">
                                +{images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            })()}

            {/* emoji */}
            <div></div>

            {/* action */}
            <div className="flex justify-around items-center text-2xl pt-4 mt-6 border-t border-gray-300">
              <button
                className="flex gap-2 cursor-pointer items-center"
                onClick={() => handleHeartPost(item.id)}
              >
                {heartedPosts[item.id] ? (
                  <IoHeartSharp className="text-red-500 transition" />
                ) : (
                  <IoHeartOutline className="text-gray-600 transition" />
                )}
                <div className="text-lg">{item.heart}</div>
              </button>

              <button className="flex gap-2 cursor-pointer items-center">
                <VscComment />
                <div className="text-lg">{item.comment}</div>
              </button>

              <button className="flex gap-2 cursor-pointer items-center">
                <PiShareFatLight />
                <div className="text-lg">{item.share}</div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* list friend */}
      <div className="flex-col me-4 my-4 overflow-y-auto w-[380px] shadow lg:flex hidden scrollbar-hide bg-white">
        {/* List active friend */}
        <div>
          <div className="flex py-4 px-2 justify-between items-center">
            <div>Bạn bè hoạt động</div>
            <div className="flex items-center gap-4">
              <div>
                <RiSearchLine />
              </div>
              <div>
                <HiOutlineDotsHorizontal />
              </div>
            </div>
          </div>

          {listActiveFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-3 py-2 px-2 hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={friend.userAvatar}
                  alt={friend.userName}
                />
                {/* chấm xanh online */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="text-gray-800 text-sm font-medium">
                {friend.userName}
              </div>
            </div>
          ))}
        </div>

        {/* List group */}
        <div>
          <div className="flex py-4 px-2 border-t border-gray-400 justify-between items-center">
            <div>Nhóm chat</div>
            <div className="flex items-center gap-4">
              <div>
                <RiSearchLine />
              </div>
              <div>
                <HiOutlineDotsHorizontal />
              </div>
            </div>
          </div>

          {listGroup.map((group) => (
            <div
              key={group.id}
              className="flex py-2 px-2 hover:bg-gray-200 cursor-pointer items-center gap-2"
            >
              <img
                className="w-10 h-10 rounded-full"
                src={group.groupAvatar}
                alt=""
              />

              <div>
                {group.groupName} {group.id}
              </div>
            </div>
          ))}
        </div>
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
