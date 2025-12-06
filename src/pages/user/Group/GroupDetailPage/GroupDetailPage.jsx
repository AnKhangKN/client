import React, { useEffect, useState } from "react";
import * as ValidateToken from "@/utils/token.utils";
import * as GroupServices from "@/services/user/GroupServices";
import { useLocation } from "react-router-dom";
import SidebarGroupDetail from "@/components/user/SidebarGroupDetail/SidebarGroupDetail";
import { useSelector } from "react-redux";
import bgCover from "@/assets/bgTest/bgTest.jpg";

// Icons + Components thiếu
import { RiCameraLensFill } from "react-icons/ri";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";

const GroupDetailPage = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const [group, setGroup] = useState({}); // <-- Sửa []
  const [previewCover, setPreviewCover] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [groupPrivacy, setGroupPrivacy] = useState(null);
  const [groupAvatar, setGroupAvatar] = useState(null);

  // Chọn file
  const handleSelectFile = (e, setState) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setState(previewURL);
  };

  const handleCancel = (resetFn) => resetFn(null);

  const handleConfirmUserCover = async () => {
    // TODO: gọi API update ảnh cover
    console.log("Cập nhật ảnh cover…");
  };

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();
        const groupId = location.pathname.split("/")[3];
        if (!groupId) return;

        const group = await GroupServices.getGroupDetail(accessToken, groupId);

        setGroup(group);
        setGroupPrivacy(group.groupPrivacy || "public");
        setCoverImage(group.groupCoverImage);
        setGroupAvatar(group.groupAvatar);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupDetail();
  }, [location]);

  return (
    <div className="flex">
      <SidebarGroupDetail groupPrivacy={groupPrivacy} />

      <div className="flex-1 flex-col">
        {/* Cover */}
        <div className="bg-gray-200 p-8">
          <div
            className="relative w-full pb-[35%] bg-cover bg-center rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${previewCover || coverImage || bgCover})`,
            }}
          >
            {/* Chỉ admin mới thay ảnh */}
            {group?.groupAdmin?.includes(user.id) && (
              <label className="absolute flex items-center gap-2 right-4 bottom-4 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer shadow">
                <RiCameraLensFill className="text-lg" />
                <span>Thêm ảnh</span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleSelectFile(e, setPreviewCover)}
                />
              </label>
            )}

            {/* Khi người dùng chọn ảnh → Hiện nút OK/Hủy */}
            {previewCover && (
              <div className="absolute flex gap-2 right-4 bottom-4 bg-white p-4 rounded-lg shadow">
                <ButtonComponent
                  text="OK"
                  width="w-28"
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

          {/* group Avatar */}
          <div className="p-4">
            <div className="flex items-end space-x-4">
              <img
                className="w-20 h-20 rounded-full"
                src={groupAvatar}
                alt=""
              />
              <div>
                <div className="text-2xl">{group.groupName}</div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Nhóm {group.groupPrivacy}</span>
                  <div className="bg-gray-600 w-1 h-1 rounded-full"></div>
                  <span>{group.groupMember?.length} thành viên</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 py-6">content</div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
