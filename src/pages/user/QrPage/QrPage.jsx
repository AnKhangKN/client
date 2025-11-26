import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserQRCode from "../../../components/user/UserQRCode/UserQRCode";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import { IoIosArrowRoundBack } from "react-icons/io";
import ViteLogo from "/vite.svg";

const gradientColors = ["#f09433", "#8e44ad", "#ff9a9e"];

const QrPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState(gradientColors[0]); // màu mặc định là gradient đầu tiên

  const downloadQR = () => {
    const qrCanvas = document
      .getElementById("qr-code")
      ?.querySelector("canvas");

    if (!qrCanvas) return alert("Không tìm thấy canvas của QR!");

    const text = user.userName;

    // Canvas mới để gộp QR + text
    const newCanvas = document.createElement("canvas");
    const ctx = newCanvas.getContext("2d");

    const qrSize = qrCanvas.width;
    const textHeight = 50;

    newCanvas.width = qrSize;
    newCanvas.height = qrSize + textHeight;

    // Vẽ nền trắng
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Vẽ QR
    ctx.drawImage(qrCanvas, 0, 0);

    // Vẽ chữ
    ctx.font = "30px Arial";
    ctx.fillStyle = bgColor;
    ctx.textAlign = "center";
    ctx.fillText(text, qrSize / 2, qrSize + 35);

    // Tải xuống
    const link = document.createElement("a");
    link.download = `${text}-qr.png`;
    link.href = newCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="text-white flex justify-center items-center relative"
      style={{
        backgroundColor: bgColor,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <button
        className="cursor-pointer absolute top-1/4 left-1/5 text-4xl"
        onClick={() => navigate(`/profile/${user.userName}`)}
      >
        <IoIosArrowRoundBack />
      </button>

      <div className="flex items-center gap-10 mt-4 justify-center">
        <div
          className="bg-white pb-6 overflow-hidden rounded-lg flex flex-col items-center"
          id="qr-code-container"
        >
          <UserQRCode
            value={`http://localhost:5173/profile/${user.userName}`}
            logoImage={user.userAvatar ? user.userAvatar : ViteLogo}
            fgColor={bgColor}
          />
          <div
            className={`text-center text-lg font-semibold`}
            style={{
              color: bgColor,
            }}
          >
            {user.userName}
          </div>
        </div>

        <div className="flex flex-col gap-6 max-w-md">
          <div className="text-xl">
            Mã QR giúp mọi người theo dõi bạn một cách nhanh chóng
          </div>
          <div>
            Mọi người có thể xem trang cá nhân của bạn bằng cách dùng camera
            trên điện thoại thông minh để quét mã QR. Hãy tải mã QR của bạn
            xuống rồi in ra, sau đó dán mã này lên sản phẩm, áp phích, v.v.
          </div>

          {/* Danh sách gradient giống Instagram */}
          <div className="flex gap-3 flex-wrap mt-2">
            {gradientColors.map((gradient, index) => (
              <div
                key={index}
                onClick={() => setBgColor(gradient)}
                style={{
                  background: gradient,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    bgColor === gradient ? "3px solid white" : "1px solid #ccc",
                }}
              />
            ))}
          </div>

          <ButtonComponent text="Tải mã QR xuống" onClick={downloadQR} />
        </div>
      </div>
    </div>
  );
};

export default QrPage;
