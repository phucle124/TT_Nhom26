-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th10 05, 2025 lúc 12:40 PM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `student_portal`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `materials`
--

DROP TABLE IF EXISTS `materials`;
CREATE TABLE IF NOT EXISTS `materials` (
  `material_id` int NOT NULL AUTO_INCREMENT COMMENT 'Mã tài liệu môn học',
  `subject_id` int NOT NULL COMMENT 'Mã môn học (FK)',
  `uploader_id` int NOT NULL COMMENT 'Mã người tải lên (FK)',
  `name` varchar(255) NOT NULL COMMENT 'Tên tài liệu',
  `file_path` varchar(255) NOT NULL COMMENT 'Đường dẫn tới File',
  `upload_date` datetime NOT NULL COMMENT 'Ngày, giờ tải lên File',
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT COMMENT 'Mã thông báo',
  `name` varchar(255) NOT NULL COMMENT 'Tên bảng thông báo',
  `content` text NOT NULL COMMENT 'Nội dung',
  `create_day` datetime NOT NULL COMMENT 'Ngày thông báo',
  `type` enum('Cá nhân','Môn học','Toàn trường') NOT NULL COMMENT 'Loại phạm vi thông báo',
  `subject_id` int DEFAULT NULL COMMENT 'Gắn kèm với môn học (nếu có)',
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `read_notifications`
--

DROP TABLE IF EXISTS `read_notifications`;
CREATE TABLE IF NOT EXISTS `read_notifications` (
  `student_id` int NOT NULL,
  `notification_id` int NOT NULL,
  `read_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`,`notification_id`),
  KEY `notification_id` (`notification_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `schedules`
--

DROP TABLE IF EXISTS `schedules`;
CREATE TABLE IF NOT EXISTS `schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT COMMENT 'Mã lịch học',
  `student_id` int NOT NULL COMMENT 'Mã sinh viên (FK)',
  `subject_id` int NOT NULL COMMENT 'Mã môn học (FK)',
  `day` varchar(10) NOT NULL COMMENT 'Thứ trong tuần',
  `start_time` time NOT NULL COMMENT 'Giờ bắt đầu môn',
  `end_time` time NOT NULL COMMENT 'Giờ kết thúc môn',
  `note` text NOT NULL COMMENT 'Ghi chú',
  PRIMARY KEY (`schedule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `student_id` int NOT NULL COMMENT 'Mã số SV',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Tên SV hiển thị/dùng để đăng nhập',
  `email` varchar(100) NOT NULL COMMENT 'Email SV',
  `password` varchar(255) NOT NULL COMMENT 'Mật khẩu',
  `class` varchar(50) NOT NULL COMMENT 'Lớp',
  `create_date` datetime NOT NULL COMMENT 'Ngày, giờ tạo tài khoản',
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`student_id`, `username`, `email`, `password`, `class`, `create_date`) VALUES
(1, 'Lê Văn A', 'lva@student.stu.edu.vn', '123', 'D22_TH14', '2025-10-03 00:54:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `subjects`
--

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `subject_id` int NOT NULL AUTO_INCREMENT COMMENT 'Mã môn học',
  `subject_name` varchar(100) NOT NULL COMMENT 'Tên môn học',
  `teacher_name` varchar(50) NOT NULL COMMENT 'Tên giảng viên',
  `credit` int NOT NULL COMMENT 'Số tín chỉ',
  `room` varchar(50) NOT NULL COMMENT 'Tên phòng học',
  `semester` varchar(10) NOT NULL COMMENT 'Học kỳ',
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `teachers`
--

DROP TABLE IF EXISTS `teachers`;
CREATE TABLE IF NOT EXISTS `teachers` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
