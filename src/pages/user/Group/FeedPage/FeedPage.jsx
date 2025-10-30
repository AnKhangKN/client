import React from "react";
import LogoCTUT from "../../../../assets/logo/logo-ctut.png";
import fileTestWord from "../../../../assets/fileTest/Filetestword.docx";
import fileTestExcel from "../../../../assets/fileTest/filetestexcel.xlsx";
import fileTestPowerpoint from "../../../../assets/fileTest/filetestpowerpoint.pptx";
import fileTestPdf from "../../../../assets/fileTest/Filetestpdf.pdf";
import PostComponent from "../../../../components/user/PostComponent/PostComponent";
import video_doc from "../../../../assets/videoTest/video_doc.mp4";
import video_ngang from "../../../../assets/videoTest/video_ngang.mp4";

const FeedPage = () => {
  const postsList = [
    {
      _id: "1", // dùng _id cho thống nhất với MongoDB
      group: {
        _id: "g1",
        groupAvatar: LogoCTUT,
        groupName: "Nhóm công nghệ thông tin",
      },
      author: {
        _id: "u1",
        userAvatar: LogoCTUT,
        firstName: "Khang",
      },
      createdAt: "2024-10-13",
      content:
        "Nội dung bài post với 2 nếu quá dài thì sao 2 dòng thì sao quá dài hiện chữ xem thêm thì sao nữa",
      bgContent: "",
      hashtag: ["#CongNgheThongTin"],
      emotion: "vui",
      medias: [
        {
          type: "image",
          url: LogoCTUT,
        },
      ],
      files: [
        { fileName: "filetestexcel.xlsx", fileUrl: fileTestExcel },
        { fileName: "Filetestpdf.pdf", fileUrl: fileTestPdf },
        { fileName: "Filetestword.docx", fileUrl: fileTestWord },
        { fileName: "filetestpowerpoint.pptx", fileUrl: fileTestPowerpoint },
      ],
      privacy: "public",
      heartsCount: 300,
      commentsCount: 45,
      sharesCount: 10,
      likes: ["u2", "u3"], // id user like
    },
    {
      _id: "2",
      group: {
        _id: "g2",
        groupAvatar: LogoCTUT,
        groupName: "Nhóm công nghệ thông tin",
      },
      author: {
        _id: "u2",
        userAvatar: LogoCTUT,
        firstName: "Khang",
      },
      createdAt: "13/10/2024 6H30",
      content:
        "Nội dung bài post quá dài gồm 3 ảnh (nội dung dài quá thể có thể hơn 2 dòng, nếu nội dung bài viết quá dài hơn 2 dòng sẽ hiện ... ở dưới sẽ hiện xem thêm khi click vào xem thêm sẽ hiện full bài post gồm tất cả nội dung của bài viết người xem có thể xem toàn bộ bài viết trên hoạt ảnh cũng sẽ chen lên các nội dung khiến bài post dài ra hơn bình thường).",
      bgContent: "",
      hashtag: ["#CongNgheThongTin", "#CTUT"],
      emotion: "buồn",
      medias: [
        {
          type: "image",
          url: LogoCTUT,
        },
        {
          type: "video",
          url: video_ngang,
        },
      ],
      files: [],
      privacy: "public",
      heartsCount: 300,
      commentsCount: 45,
      sharesCount: 10,
      likes: ["u2", "u3"],
    },
    {
      _id: "3",
      group: {
        _id: "g3",
        groupAvatar: LogoCTUT,
        groupName: "Nhóm công nghệ thông tin",
      },
      author: {
        _id: "u3",
        userAvatar: LogoCTUT,
        firstName: "Khang",
      },
      createdAt: "13/10/2024 6H30",
      content: "Nội dung bài post với 1 ảnh",
      bgContent: "",
      hashtag: ["#CongNgheThongTin", "#CTUT", "#HeThongThongTin"],
      emotion: "buồn",
      medias: [
        {
          type: "image",
          url: LogoCTUT,
        },
        {
          type: "video",
          url: video_ngang,
        },
      ],
      files: [
        {
          fileName: "filetestexcel.xlsx",
          file: fileTestExcel,
        },
        {
          fileName: "Filetestpdf.pdf",
          file: fileTestPdf,
        },
        {
          fileName: "Filetestword.docx",
          file: fileTestWord,
        },
      ],
      privacy: "public",
      heartsCount: 300,
      commentsCount: 45,
      sharesCount: 10,
      likes: ["u2", "u3"],
    },
    {
      _id: "4",
      group: {
        _id: "g4",
        groupAvatar: LogoCTUT,
        groupName: "Nhóm công nghệ thông tin",
      },
      author: {
        _id: "u4",
        userAvatar: LogoCTUT,
        firstName: "Khang",
      },
      createdAt: "13/10/2024 6H30",
      content: "Nội dung bài post trên 3 ảnh",
      bgContent: "",
      hashtag: ["#CongNgheThongTin"],
      emotion: "buồn",
      medias: [
        {
          type: "image",
          url: LogoCTUT,
        },
        {
          type: "video",
          url: video_doc,
        },
      ],
      files: [{ fileName: "filetestexcel.xlsx", file: fileTestExcel }],
      privacy: "public",
      heartsCount: 300,
      commentsCount: 45,
      sharesCount: 10,
      likes: ["u2", "u3"],
    },
  ];

  return (
    <div className="dark:bg-[#1c1c1d] dark:text-white flex justify-center">
      {/* Bài viết */}
      <div className=" w-full max-w-[600px]">
        <PostComponent postsList={postsList} />
      </div>
    </div>
  );
};

export default FeedPage;
