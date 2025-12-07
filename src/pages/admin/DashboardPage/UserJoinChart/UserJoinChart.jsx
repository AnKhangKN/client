import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserJoinChart = ({ user, teacher }) => {
  // Tách sinh viên từ user
  const students = user.filter((u) => !u.isTeacher);

  // Đếm theo tháng
  const studentByMonth = countByMonth(students);
  const teacherByMonth = countByMonth(teacher);

  const data = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Sinh viên tham gia",
        data: studentByMonth,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Giảng viên tham gia",
        data: teacherByMonth,
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Thống kê số người tham gia hệ thống theo từng tháng",
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full h-[350px] border border-gray-200 shadow rounded-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserJoinChart;

const countByMonth = (list) => {
  const result = Array(12).fill(0);

  list.forEach((item) => {
    const month = new Date(item.createdAt).getMonth();
    result[month]++;
  });

  return result;
};
