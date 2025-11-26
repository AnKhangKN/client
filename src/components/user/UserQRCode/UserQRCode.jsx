import React from "react";
import ViteLogo from "/vite.svg";
import { QRCode } from "react-qrcode-logo";

const UserQRCode = ({ value, fgColor, logoImage, qrStyle = "dots" }) => {
  return (
    <div id="qr-code">
      <QRCode
        value={value}
        level="H"
        fgColor={fgColor}
        logoImage={logoImage}
        ecLevel="H"
        qrStyle={qrStyle}
        quietZone={30}
      />
    </div>
  );
};

export default UserQRCode;
