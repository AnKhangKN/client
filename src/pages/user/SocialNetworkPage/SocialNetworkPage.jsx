import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputComponent from "@/components/shared/InputComponent/InputComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import * as ValidateToken from "@/utils/token.utils";
import * as UserServices from "@/services/user/UserServices";
import { updateUser } from "@/features/user/userSlice";

const SocialNetworkPage = () => {
  const user = useSelector((state) => state.user);
  console.log(user.orderConnect);

  const dispatch = useDispatch();

  const [orderConnect, setOrderConnect] = useState([
    { linkName: "", linkConnect: "" },
  ]);

  useEffect(() => {
    setOrderConnect(
      user.orderConnect?.length
        ? user.orderConnect
        : [{ linkName: "", linkConnect: "" }]
    );
  }, [user]);

  const handleAddLink = () => {
    setOrderConnect([...orderConnect, { linkName: "", linkConnect: "" }]);
  };

  const handleRemoveLink = (index) => {
    setOrderConnect(orderConnect.filter((_, i) => i !== index));
  };

  const handleChangeLink = (index, field, value) => {
    const newLinks = [...orderConnect];
    newLinks[index][field] = value;
    setOrderConnect(newLinks);
  };

  const handleSave = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      // Validate all links trước khi submit
      for (let link of orderConnect) {
        if (link.linkConnect && !/^https?:\/\/.+/.test(link.linkConnect)) {
          alert(
            `Link "${link.linkName}" không hợp lệ! Phải bắt đầu bằng http hoặc https`
          );
          return;
        }
      }

      const res = await UserServices.updateOrderConnect(
        accessToken,
        orderConnect
      );

      if (res) {
        dispatch(updateUser(res.data));
        alert("Cập nhật liên kết thành công!");
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi server, vui lòng thử lại");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Mạng xã hội</h2>

      {orderConnect.map((link, index) => (
        <div key={index} className="flex gap-2 items-center">
          <InputComponent
            label="Tên liên kết"
            value={link.linkName}
            onChange={(e) =>
              handleChangeLink(index, "linkName", e.target.value)
            }
          />
          <InputComponent
            label="Link"
            value={link.linkConnect}
            onChange={(e) =>
              handleChangeLink(index, "linkConnect", e.target.value)
            }
          />
          {orderConnect.length > 1 && (
            <button
              className="text-red-500"
              onClick={() => handleRemoveLink(index)}
            >
              Xóa
            </button>
          )}
        </div>
      ))}

      <button className="text-blue-500 mt-2" onClick={handleAddLink}>
        Thêm liên kết
      </button>

      <div className="flex justify-end mt-4">
        <ButtonComponent text="Lưu" width="w-40" onClick={handleSave} />
      </div>
    </div>
  );
};

export default SocialNetworkPage;
