import React from "react";
import ViteLogo from "/vite.svg";
import { QRCode } from "react-qrcode-logo";

const UserQRCode = ({
  value,
  fgColor,
  logoImage = ViteLogo,
  qrStyle = "dots",
}) => {
  return (
    <QRCode
      value={value}
      level="H"
      fgColor={fgColor}
      logoImage={logoImage}
      ecLevel="H"
      qrStyle={qrStyle}
    />
  );
};

export default UserQRCode;
