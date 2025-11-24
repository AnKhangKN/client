import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserQRCode from "../../../components/user/UserQRCode/UserQRCode";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";

const gradientColors = ["#f09433", "#8e44ad", "#ff9a9e"];

const QrPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState(gradientColors[0]); // màu mặc định là gradient đầu tiên

  const downloadQR = () => {
    const container = document.getElementById("qr-code-container");
    if (!container) return;

    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${user.userName}-qr.png`;
    link.click();
  };

  return (
    <div
      className="text-white"
      style={{
        backgroundColor: bgColor,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div onClick={() => navigate(`/profile/${user.userName}`)}>Back</div>

      <div className="flex items-start gap-10 mt-4">
        <div
          className="bg-white p-6 rounded-lg flex flex-col items-center"
          id="qr-code-container"
        >
          <UserQRCode
            value={`http://localhost:5173/profile/${user.userName}`}
            fgColor={bgColor}
          />
          <div className="mt-2 text-center text-lg font-semibold">
            {user.userName}
          </div>
        </div>

        <div className="flex flex-col gap-6 max-w-md">
          <div>Mã QR giúp mọi người theo dõi bạn một cách nhanh chóng</div>
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
                    bgColor === gradient ? "3px solid black" : "1px solid #ccc",
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
