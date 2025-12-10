import React, { useState } from "react";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import TextareaComponent from "@/components/shared/TextareaComponent/TextareaComponent";
import TextCollapse from "../TextCollapse/TextCollapse";
import FileItem from "../FileItem/FileItem";
import MediaLayout from "../MediaLayout/MediaLayout";
import * as Validate from "@/utils/token.utils";
import * as ShareServices from "@/services/user/ShareServices";
import AvatarDefault from "../../../../assets/logo/avatar_default.webp";
import * as NotificationServices from "@/services/shared/NotificationServices";

const SharePostModal = ({ item, handleCloseSharePostModal }) => {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSharePost = async () => {
    if (!item) return;
    setLoading(true);
    try {
      const accessToken = await Validate.getValidAccessToken();
      const data = { post: item?.data?._id, caption };
      await ShareServices.sharePost(accessToken, data);

      const dataNotification = {
        user: item?.data?.author?._id, // chủ bài viết
        type: "share",
        post: item?.data?._id,
        message: "đã chia sẽ bài viết bài viết",
      };

      await NotificationServices.createNotification(
        accessToken,
        dataNotification
      );

      setLoading(false);
      handleCloseSharePostModal();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center p-4"
      onClick={handleCloseSharePostModal} // click outside
    >
      <div
        className="bg-white dark:bg-[#252728] rounded-lg shadow-lg w-full max-w-2xl relative p-6 overflow-y-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Close button */}
        <button
          onClick={handleCloseSharePostModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="mb-4 text-xl font-semibold">
          Chia sẻ bài viết của{" "}
          <span className="font-bold">
            {item.data.author?.lastName} {item.data.author?.firstName}
          </span>
        </h2>

        {/* Share caption */}
        <TextareaComponent
          label="Nội dung chia sẻ"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Original post */}
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center mb-2 gap-2">
            <img
              src={item.data.author?.userAvatar || AvatarDefault}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm font-medium">
              {item.data.author?.lastName} {item.data.author?.firstName}
            </div>
          </div>

          <TextCollapse
            text={item.data.content || ""}
            bgColor={item.data.bgContent || ""}
            haveFiles={[
              ...(item.data.medias || []),
              ...(item.data.documents || []),
            ]}
          />

          {/* Files */}
          {item.data.documents?.length > 0 && (
            <div className="my-3 flex flex-col gap-2">
              {item.data.documents.map((f, i) => (
                <FileItem key={i} file={f} />
              ))}
            </div>
          )}

          {/* Media */}
          {item.data.medias?.length > 0 && (
            <div className="my-3">
              <MediaLayout medias={item.data.medias} />
            </div>
          )}
        </div>

        {/* Share button */}
        <div className="mt-4">
          <ButtonComponent
            text="Chia sẻ"
            loading={loading}
            onClick={handleSharePost}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
