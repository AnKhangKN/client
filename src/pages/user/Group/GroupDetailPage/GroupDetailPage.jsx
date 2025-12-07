import React, { useEffect, useState } from "react";
import * as ValidateToken from "@/utils/token.utils";
import * as GroupServices from "@/services/user/GroupServices";
import * as ReportServices from "@/services/shared/ReportServices";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Components
import SidebarGroupDetail from "@/components/user/SidebarGroupDetail/SidebarGroupDetail";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import PostCreateComponent from "@/components/user/PostCreateComponent/PostCreateComponent";
import PostComponent from "@/components/user/Post/PostComponent/PostComponent";

// Icons
import { RiCameraLensFill, RiMoreLine } from "react-icons/ri";
import { GiEarthAmerica } from "react-icons/gi";
import { IoMdLock } from "react-icons/io";

import bgCover from "@/assets/bgTest/bgTest.jpg";
import logoTest from "@/assets/logo/logo-ctut.png";
import GroupIntroduction from "./GroupIntroduction/GroupIntroduction";

const GroupDetailPage = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const [group, setGroup] = useState({});
  const [modalAction, setModalAction] = useState(false);

  const [previewCover, setPreviewCover] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [groupPrivacy, setGroupPrivacy] = useState(null);
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  // Xử lý chọn file
  const handleSelectFile = (e, setState) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setState(URL.createObjectURL(file));
  };

  const handleCancel = (resetFn) => resetFn(null);

  const handleConfirmUserCover = async () => {
    console.log("Cập nhật ảnh cover…");
    // TODO: gọi API upload cover
  };

  // Fetch group detail
  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();

        // lấy phần cuối cùng của URL
        const groupId = location.pathname.split("/").pop();
        if (!groupId) return;

        const res = await GroupServices.getGroupDetail(accessToken, groupId);
        console.log(res.data.posts);
        setPosts(res.data.posts);

        setGroup(res.data.group);

        setGroupPrivacy(res.data.group.groupPrivacy);
        setCoverImage(res.data.group.groupCoverImage);
        setGroupAvatar(res.data.group.groupAvatar);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupDetail();
  }, [location]);

  // Gửi báo cáo nhóm
  const handleSendReport = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      await ReportServices.createReport(accessToken, {
        reportType: "Group",
        reportModels: group._id,
        reason: selectedReason,
        reportContent: otherReason,
      });

      setReportModal(false);
      setSelectedReason("");
      setOtherReason("");
    } catch (err) {
      console.log(err);
      setReportModal(false);
      setSelectedReason("");
      setOtherReason("");
    }
  };

  return (
    <div className="flex">
      {/* LEFT SIDEBAR */}
      <SidebarGroupDetail />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-neutral-100 p-4 overflow-hidden h-screen">
        <div className="overflow-y-auto h-full">
          {/* ————————— COVER ————————— */}
          <div className="p-8 bg-white shadow rounded-xl mb-6">
            <div
              className="relative w-full pb-[35%] bg-cover bg-center rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${
                  previewCover || coverImage || bgCover
                })`,
              }}
            >
              {/* Chỉ admin mới có quyền đổi ảnh */}
              {group?.groupAdmin?.includes(user.id) && (
                <label className="absolute flex items-center gap-2 right-4 bottom-4 bg-white px-4 py-2 rounded-lg cursor-pointer shadow">
                  <RiCameraLensFill className="text-lg" />
                  <span>Thay ảnh bìa</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSelectFile(e, setPreviewCover)}
                  />
                </label>
              )}

              {/* Nút lưu / hủy */}
              {previewCover && (
                <div className="absolute flex gap-2 right-4 bottom-4 bg-white p-3 rounded-lg shadow">
                  <ButtonComponent
                    text="Lưu"
                    width="w-24"
                    onClick={handleConfirmUserCover}
                  />
                  <ButtonComponent
                    text="Hủy"
                    width="w-20"
                    bgColor="bg-gray-200"
                    textColor="text-black"
                    onClick={() => handleCancel(setPreviewCover)}
                  />
                </div>
              )}
            </div>

            {/* ————————— AVATAR + GROUP INFO ————————— */}
            <div className="p-4 flex justify-between items-end mt-4">
              <div className="flex items-center gap-4">
                <img
                  src={groupAvatar || logoTest}
                  className="w-24 h-24 rounded-full object-cover shadow"
                  alt="Group Avatar"
                />

                <div>
                  <h1 className="text-2xl font-bold">{group.groupName}</h1>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <span>
                      {groupPrivacy === "public"
                        ? "Nhóm công khai"
                        : "Nhóm riêng tư"}
                    </span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{group.groupMember?.length} thành viên</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2">
                {group.groupMember?.includes(user.id) ? (
                  <ButtonComponent text="Mời bạn" />
                ) : (
                  <ButtonComponent text="Xin vào" />
                )}

                <div
                  className="relative bg-gray-200 rounded-lg w-28 h-11 flex items-center justify-center cursor-pointer"
                  onClick={() => setModalAction((prev) => !prev)}
                >
                  <RiMoreLine size={24} />

                  {modalAction && (
                    <div className="absolute top-14 right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-20 w-52">
                      <div className="hover:bg-gray-100 p-3 cursor-pointer">
                        Chia sẻ
                      </div>
                      <div
                        className="hover:bg-gray-100 p-3 cursor-pointer"
                        onClick={() => setReportModal(true)}
                      >
                        Báo cáo nhóm
                      </div>
                      <div className="hover:bg-gray-100 p-3 cursor-pointer text-red-500">
                        Rời nhóm
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ————————— REPORT MODAL ————————— */}
          {reportModal && (
            <div className="fixed inset-0 z-20 bg-black/40 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg w-[400px]">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-bold text-lg">Báo cáo nhóm</div>
                  <div
                    onClick={() => setReportModal(false)}
                    className="cursor-pointer text-xl"
                  >
                    ×
                  </div>
                </div>

                <div className="mb-3">
                  Đang báo cáo nhóm: <b>{group.groupName}</b>
                </div>

                <div className="mb-3">
                  <label className="font-medium">Lý do báo cáo:</label>
                  <select
                    className="w-full mt-1 border p-2 rounded"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="hate">Nội dung thù địch</option>
                    <option value="violence">Bạo lực</option>
                    <option value="spam">Spam / Quảng cáo</option>
                    <option value="nudity">Nhạy cảm</option>
                    <option value="illegal">Vi phạm pháp luật</option>
                    <option value="misinformation">Thông tin sai</option>
                    <option value="harassment">Quấy rối</option>
                    <option value="disturbing">Gây khó chịu</option>
                    <option value="scam">Lừa đảo</option>
                    <option value="other">Khác...</option>
                  </select>
                </div>

                {selectedReason === "other" && (
                  <textarea
                    rows="3"
                    placeholder="Nhập lý do..."
                    className="w-full border p-2 rounded mb-3"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  ></textarea>
                )}

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded w-full"
                  onClick={handleSendReport}
                >
                  Gửi báo cáo
                </button>
              </div>
            </div>
          )}

          {/* ————————— CONTENT ————————— */}
          <div className="flex gap-6 px-12">
            {/* LEFT — POST AREA */}
            <div className="flex-1 flex flex-col gap-4">
              {group.groupMember?.includes(user.id) && <PostCreateComponent />}

              <PostComponent postsList={posts} />
            </div>

            {/* RIGHT — INFO SIDEBAR */}
            <GroupIntroduction
              groupPrivacy={groupPrivacy}
              introduction={group.introduction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
