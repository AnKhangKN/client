import { useEffect } from "react";

/**
 * Hook giúp tự động đóng modal (hoặc thực hiện hành động) khi click ra ngoài vùng ref
 * @param {React.RefObject} ref - vùng muốn kiểm tra
 * @param {Function} onOutsideClick - hàm được gọi khi click ra ngoài
 */
export default function useClickOutsideForPosition(ref, onOutsideClick) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick?.(); // gọi callback khi click ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onOutsideClick]);
}
