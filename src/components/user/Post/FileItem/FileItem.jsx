import {
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

const FileItem = ({ file }) => {
  const fileUrl = file.url;
  const fileName = file.name;
  const ext = fileName.split(".").pop()?.toLowerCase();

  let icon;
  switch (ext) {
    case "doc":
    case "docx":
      icon = <FaFileWord className="text-blue-600 text-2xl" />;
      break;
    case "xls":
    case "xlsx":
      icon = <FaFileExcel className="text-green-600 text-2xl" />;
      break;
    case "ppt":
    case "pptx":
      icon = <FaFilePowerpoint className="text-orange-600 text-2xl" />;
      break;
    case "pdf":
      icon = <FaFilePdf className="text-red-600 text-2xl" />;
      break;
    default:
      icon = <FaFileAlt className="text-gray-600 text-2xl" />;
      break;
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.stopPropagation(); // tránh trigger các event cha nếu có
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      }}
      className="flex items-center gap-3 p-2 border border-gray-300 dark:border-[#3b3d3e] rounded-md 
    hover:bg-gray-100 dark:hover:bg-[#3b3d3e] transition"
    >
      {icon}
      <span className="truncate text-sm text-blue-400 hover:underline">
        {fileName}
      </span>
    </a>
  );
};

export default FileItem;
