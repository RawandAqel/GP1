-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2025 at 05:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `in_your_service`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `token`, `user_id`) VALUES
(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0MjY4Njc5NywiZXhwIjoxNzQyNjkwMzk3fQ.PI7cFqrn7bnGvfGNDy2hQjKaL1eU2xTAZoHtXRytSx4', 2),
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0NTA2NzUxMCwiZXhwIjoxNzQ1MDcxMTEwfQ.OVfKxp4cUXKQocGLx7b_HlmWvtJmr23Y8am5wId6Frw', 2),
(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0NTA2OTExMSwiZXhwIjoxNzQ1MDcyNzExfQ.w21v0TK5UD26lkOuwnLTBT-zppALYn7-pcbWTGgeshU', 2),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0NTkyMzg4NywiZXhwIjoxNzQ1OTI3NDg3fQ.iC7dBNRvlUAcPgZp9y1MSroxTWnxHjf50HE-cOEGDAk', 2),
(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc0NTkyMzk5MywiZXhwIjoxNzQ1OTI3NTkzfQ.n7xoMOWcoHjt31lxwrbvm9-PfQs-mJd4YU7qK48hWOw', 4),
(13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc0NTk2NTY0NCwiZXhwIjoxNzQ1OTY5MjQ0fQ.-zRg_NcgW7zeOPBIdXdlnLNlgMaJ44of94ETtxn-Od4', 4),
(14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NTk2ODMzMiwiZXhwIjoxNzQ1OTcxOTMyfQ.EHiD_GKtjDZhDqEgAqMhbuT6QLoYbC3oOqG-OqdN6pY', 3),
(15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NTk2ODc0NSwiZXhwIjoxNzQ1OTcyMzQ1fQ.pLY8BCKfcEh5Gpxd3UAyCrM2lYU7L-609GvIDh6InUM', 3),
(16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjA2MTg1NiwiZXhwIjoxNzQ2MDY1NDU2fQ.gOtGW5cZwUjKIZaE5Mp17g5xemsP4aMFNJ5ZXpXhhhg', 3),
(17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjA2MjAzMywiZXhwIjoxNzQ2MDY1NjMzfQ.-O89-1GN4LAjru6ERx-rNT4RYjLywcmlj-D4I5dP32M', 3),
(18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjA2NzA0MCwiZXhwIjoxNzQ2MDcwNjQwfQ.vHn6B0-Z-Qg-DU8rg7u3t_0pdzoJXD8YhlvHIBmkkgA', 3),
(19, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjEzMzk4MSwiZXhwIjoxNzQ2MTM3NTgxfQ.fedotBlklMRahsXADGpa_v98y8-9CjX9pgT1QkvROkw', 3),
(20, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjEzNTMyMiwiZXhwIjoxNzQ2MTM4OTIyfQ.IujWgNn3zZZS6SJa_-kU-GpDyaDkJIWKx_BPsrHBrl8', 3),
(21, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0Njc0NTM1NSwiZXhwIjoxNzQ2NzQ4OTU1fQ.9ufHJ7dHA7tJUf9cG6uk83lKKPpjIIKp2bA2kvQ-gp0', 3),
(22, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc0NjgyMjExNCwiZXhwIjoxNzQ2ODI1NzE0fQ.ucJZeebCOzB3fWZq0_A9p8UWbJ0ZOFelPVTzsOFOWHI', 6),
(23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc0NjgyNTgyNSwiZXhwIjoxNzQ2ODI5NDI1fQ.qRI60C6PaPuOTItYMXhKObPZrOD8KmHmYRpfx44kjNk', 6),
(24, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjgyNzkxMiwiZXhwIjoxNzQ2ODMxNTEyfQ.iEVCVZpgOdZliq1PRiL2PLnh8WyPYey_Et0iPg8gcro', 3),
(25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjgzMDQ1MywiZXhwIjoxNzQ2ODM0MDUzfQ.mXLfuV814RCFIUTugsO9oxQUeX76wQfjehgCQ16btWo', 3),
(26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NjgzMjE0MiwiZXhwIjoxNzQ2ODM1NzQyfQ.h-1YWit11_O7hth-k0bo1MUS920N7TIBMLzY7NbZoD0', 3),
(27, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc0NjgzMjE4MCwiZXhwIjoxNzQ2ODM1NzgwfQ.OaeyVacJzAzo_dpHCjo_c0xXuGMSjcxP2LNxfovA8E8', 6),
(28, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NzI2MjY4MSwiZXhwIjoxNzQ3MjY2MjgxfQ.Ry2nKG_pnjICOBMJ7MfQxxxEtyzn6rVW5ukey34_12M', 3),
(29, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc0NzI2MjkwMSwiZXhwIjoxNzQ3MjY2NTAxfQ.qGabE0TZ6YD07lSeJufBl73Pu9Anw-_VBibZlLHvVl4', 5),
(30, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc0NzQ5MTMwMCwiZXhwIjoxNzQ3NDk0OTAwfQ.zlUybgVowOXSu2_K2TBO2_NhvNeiP0cSy2tGonLY4ZA', 6),
(31, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc0NzQ5NDAwNywiZXhwIjoxNzQ3NDk3NjA3fQ.Ef_VJDH03lBOfmnqnIh6ZDN4zXfXZUVWJj2Qtzk5vgM', 6);

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `recever_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `msg`, `sender_id`, `recever_id`, `created`, `updated`) VALUES
(1, 'Hi, when can you start the project?', 1, 6, '2025-04-15 10:30:00', '2025-04-15 10:30:00'),
(2, 'We can start next Monday', 6, 1, '2025-04-15 10:35:00', '2025-04-15 10:35:00'),
(3, 'I have a leak in my bathroom', 3, 2, '2025-04-16 14:20:00', '2025-04-16 14:20:00'),
(4, 'I can come tomorrow at 9am', 2, 3, '2025-04-16 14:25:00', '2025-04-16 14:25:00');

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `zip_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `name`, `zip_code`) VALUES
(1, 'Nablus', 100),
(2, 'New York', 10001),
(3, 'Los Angeles', 90001);

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `user_id`, `created`, `updated`) VALUES
(1, 1, '2025-03-19 03:34:07', '2025-03-19 03:34:07'),
(2, 2, '2025-03-19 05:16:20', '2025-03-19 05:16:20'),
(3, 4, '2025-04-29 13:56:52', '2025-04-29 13:56:52'),
(4, 5, '2025-04-29 13:56:52', '2025-04-29 13:56:52');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `name`, `description`, `image_url`, `user_id`, `location_id`, `created`, `updated`) VALUES
(1, 'Tech Solutions Inc.', 'Providing IT services and support', 'https://example.com/techsolutions.jpg', 6, 2, '2025-04-29 13:58:43', '2025-04-29 13:58:43'),
(2, 'Home Services LLC', 'Professional home maintenance and repair', 'https://example.com/homeservices.jpg', 6, 3, '2025-04-29 13:58:43', '2025-04-29 13:58:43'),
(3, 'Tech Solutions Inc.', 'IT services company', 'https://example.com/logo.jpg', 6, 5, '2025-05-09 23:22:19', '2025-05-09 23:22:19'),
(4, 'Test', 'asfasdgsdbfdsvdsbfbfdbs', 'https://example.com/logo.jpg', 6, 6, '2025-05-17 17:16:01', '2025-05-17 17:16:01');

-- --------------------------------------------------------

--
-- Table structure for table `company_feedback`
--

CREATE TABLE `company_feedback` (
  `id` int(11) NOT NULL,
  `feedback` varchar(255) DEFAULT NULL,
  `rate` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_feedback`
--

INSERT INTO `company_feedback` (`id`, `feedback`, `rate`, `client_id`, `company_id`) VALUES
(1, 'Great IT services overall', 5, 1, 1),
(2, 'Very satisfied with the home services', 4, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `company_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job`
--

INSERT INTO `job` (`id`, `name`, `description`, `created`, `updated`) VALUES
(2, 'Senior Frontend Developer', 'Updated job requirements', '2025-04-29 14:01:02', '2025-05-10 02:18:28'),
(3, 'Pipe Repair', 'Fixing leaking pipes', '2025-04-29 14:01:02', '2025-04-29 14:01:02'),
(4, 'Electrical Installation', 'Installing new electrical systems', '2025-04-29 14:01:02', '2025-04-29 14:01:02'),
(6, 'Backend Developer', 'Node.js developer needed', '2025-05-10 02:16:11', '2025-05-10 02:16:11');

-- --------------------------------------------------------

--
-- Table structure for table `job_application`
--

CREATE TABLE `job_application` (
  `id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_application`
--

INSERT INTO `job_application` (`id`, `job_id`, `company_id`, `created`, `updated`) VALUES
(2, 2, 1, '2025-04-29 14:01:23', '2025-04-29 14:01:23'),
(3, 3, 2, '2025-04-29 14:01:23', '2025-04-29 14:01:23'),
(4, 4, 2, '2025-04-29 14:01:23', '2025-04-29 14:01:23'),
(6, 6, 1, '2025-05-10 02:16:11', '2025-05-10 02:16:11');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `zip_code` int(11) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `zip_code`, `city_id`) VALUES
(1, 105, 1),
(2, 10001, 2),
(3, 90001, 3),
(4, 301, 1),
(5, 10001, 2),
(6, 10001, 2);

-- --------------------------------------------------------

--
-- Table structure for table `pay_info`
--

CREATE TABLE `pay_info` (
  `id` int(11) NOT NULL,
  `card_number` varchar(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `month` int(2) DEFAULT NULL,
  `year` int(2) DEFAULT NULL,
  `csv` int(5) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pay_info`
--

INSERT INTO `pay_info` (`id`, `card_number`, `name`, `month`, `year`, `csv`, `user_id`) VALUES
(1, '4111111111111111', 'John Doe', 12, 26, 123, 2),
(2, '5555555555554444', 'Jane Smith', 6, 25, 456, 3),
(3, '378282246310005', 'Michael Johnson', 3, 27, 789, 4);

-- --------------------------------------------------------

--
-- Table structure for table `position_category`
--

CREATE TABLE `position_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `position_category`
--

INSERT INTO `position_category` (`id`, `name`, `code`) VALUES
(1, 'Software Developer', 101),
(2, 'IT Support', 102),
(3, 'Plumber', 201),
(4, 'Electrician', 202),
(5, 'Project Manager', 301);

-- --------------------------------------------------------

--
-- Table structure for table `position_company`
--

CREATE TABLE `position_company` (
  `id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `position_category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `position_company`
--

INSERT INTO `position_company` (`id`, `company_id`, `position_category_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 5),
(4, 2, 3),
(5, 2, 4),
(6, 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `position_provider`
--

CREATE TABLE `position_provider` (
  `id` int(11) NOT NULL,
  `service_provider_id` int(11) DEFAULT NULL,
  `position_category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `position_provider`
--

INSERT INTO `position_provider` (`id`, `service_provider_id`, `position_category_id`) VALUES
(1, 1, 1),
(2, 2, 3),
(3, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `Initial_price` float DEFAULT NULL,
  `max_price` float DEFAULT NULL,
  `actual_price` float DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `Initial_time_s` int(11) DEFAULT NULL,
  `final_time_s` bigint(20) DEFAULT NULL,
  `actual_time` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `name`, `client_id`, `team_id`, `Initial_price`, `max_price`, `actual_price`, `description`, `start_date`, `end_date`, `Initial_time_s`, `final_time_s`, `actual_time`, `created`, `updated`) VALUES
(1, 'Updated Project Name', 1, 1, 5000, 7500, 6000, 'Build a new company website', '2025-04-01', '2025-10-01', 3600, 7200, 5400, '2025-04-29 14:01:51', '2025-05-10 00:34:43'),
(2, 'Office Network Setup', 2, 2, 3000, 4500, 3200, 'Setup office network infrastructure', '2025-04-10', '2025-04-30', 1800, 3600, 2400, '2025-04-29 14:01:51', '2025-04-29 14:01:51'),
(3, 'Bathroom Remodel', 3, 3, 8000, 12000, 9500, 'Complete bathroom renovation', '2025-05-01', '2025-06-15', 7200, 14400, 10800, '2025-04-29 14:01:51', '2025-04-29 14:01:51'),
(4, 'Mobile App Development', 1, 1, 10000, 15000, NULL, 'iOS and Android app', '2025-06-01', '2025-09-01', NULL, NULL, NULL, '2025-05-09 23:55:05', '2025-05-09 23:55:05');

-- --------------------------------------------------------

--
-- Table structure for table `project_milestone`
--

CREATE TABLE `project_milestone` (
  `id` int(11) NOT NULL,
  `project_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `completion_date` date DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_milestone`
--

INSERT INTO `project_milestone` (`id`, `project_id`, `name`, `description`, `due_date`, `completed`, `completion_date`, `created`, `updated`) VALUES
(1, 1, 'Updated Milestone Name', 'Client approves initial designs', '2025-07-15', 1, NULL, '2025-05-10 00:14:25', '2025-05-10 00:27:10'),
(2, 1, 'Core Development', 'Complete main functionality', '2025-07-20', 0, NULL, '2025-05-10 00:14:25', '2025-05-10 00:14:25'),
(3, 1, 'Testing Phase', 'Quality assurance testing', '2025-08-10', 0, NULL, '2025-05-10 00:14:25', '2025-05-10 00:14:25'),
(5, 1, 'UI Implementation', 'Complete frontend development', '2025-07-10', 0, NULL, '2025-05-10 00:24:34', '2025-05-10 00:24:34');

-- --------------------------------------------------------

--
-- Table structure for table `provider_feedback`
--

CREATE TABLE `provider_feedback` (
  `id` int(11) NOT NULL,
  `feedback` varchar(255) DEFAULT NULL,
  `rate` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `service_provider_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_feedback`
--

INSERT INTO `provider_feedback` (`id`, `feedback`, `rate`, `client_id`, `service_provider_id`) VALUES
(1, 'Excellent work, very professional!', 5, 1, 1),
(2, 'Fixed my plumbing issues quickly', 4, 3, 2),
(3, 'Network setup was perfect', 5, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `provider_job`
--

CREATE TABLE `provider_job` (
  `id` int(11) NOT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `job_application_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_job`
--

INSERT INTO `provider_job` (`id`, `provider_id`, `job_application_id`, `created`, `updated`) VALUES
(12, 3, 2, '2025-05-10 02:43:56', '2025-05-10 02:43:56');

-- --------------------------------------------------------

--
-- Table structure for table `provider_team`
--

CREATE TABLE `provider_team` (
  `id` int(11) NOT NULL,
  `service_provider_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_team`
--

INSERT INTO `provider_team` (`id`, `service_provider_id`, `team_id`, `created`, `updated`) VALUES
(1, 1, 1, '2025-04-29 13:59:31', '2025-04-29 13:59:31'),
(2, 2, 3, '2025-04-29 13:59:31', '2025-04-29 13:59:31'),
(3, 3, 4, '2025-04-29 13:59:31', '2025-04-29 13:59:31'),
(4, 2, 1, '2025-05-09 23:44:39', '2025-05-09 23:44:39');

-- --------------------------------------------------------

--
-- Table structure for table `service_provider`
--

CREATE TABLE `service_provider` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bio` text DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `skills` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_provider`
--

INSERT INTO `service_provider` (`id`, `user_id`, `created`, `updated`, `bio`, `hourly_rate`, `skills`, `is_available`) VALUES
(1, 3, '2025-03-19 05:17:42', '2025-05-01 05:59:27', 'Experienced plumber with 10 years experience', 45.00, 'Plumbing, Pipe Repair, Installation', 1),
(2, 4, '2025-04-29 13:52:48', '2025-04-29 13:52:48', NULL, NULL, NULL, 1),
(3, 5, '2025-04-29 13:57:32', '2025-04-29 13:57:32', NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `service_provider_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `completed` int(11) NOT NULL,
  `cancelled` int(11) NOT NULL,
  `estimated_distance` float DEFAULT NULL,
  `estimated_timing` time DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `Initial_price` float DEFAULT NULL,
  `Maximum_price` float DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(20) DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `actual_time` int(11) DEFAULT NULL,
  `actual_price` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `service_provider_id`, `client_id`, `completed`, `cancelled`, `estimated_distance`, `estimated_timing`, `description`, `Initial_price`, `Maximum_price`, `created`, `updated`, `status`, `rejection_reason`, `notes`, `actual_time`, `actual_price`) VALUES
(1, 1, 1, 0, 0, NULL, '02:00:00', 'Develop homepage', 150, 1500, '2025-04-29 14:02:00', '2025-05-02 00:37:48', 'pending', NULL, 'Will need special tools', 90, 175.5),
(2, 1, 1, 0, 0, NULL, '02:00:00', 'Develop admin panel', 150, 2000, '2025-04-29 14:02:00', '2025-05-10 00:59:36', 'rejected', 'Testttt', 'Will need special tools', 90, 175.5),
(3, 2, 3, 0, 0, 15.5, '04:00:00', 'Replace bathroom pipes', 1200, 1800, '2025-04-29 14:02:00', '2025-04-29 14:02:00', 'pending', NULL, NULL, NULL, NULL),
(4, 3, 2, 0, 0, NULL, '06:00:00', 'Install network cables', 800, 1200, '2025-04-29 14:02:00', '2025-04-29 14:02:00', 'pending', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `name`, `description`, `company_id`, `created`, `updated`) VALUES
(1, 'Development Team', 'Software development team', 1, '2025-04-29 13:59:04', '2025-04-29 13:59:04'),
(2, 'Support Team', 'Customer support specialists', 1, '2025-04-29 13:59:04', '2025-04-29 13:59:04'),
(3, 'Plumbing Team', 'Certified plumbing professionals', 2, '2025-04-29 13:59:04', '2025-04-29 13:59:04'),
(4, 'Electrical Team', 'Licensed electricians', 2, '2025-04-29 13:59:04', '2025-04-29 13:59:04'),
(5, 'QA Team', 'Quality assurance team', 1, '2025-05-09 23:35:38', '2025-05-09 23:35:38');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `phone`, `password`, `image_url`, `facebook_url`, `location_id`, `created`, `updated`) VALUES
(1, 'Rawand', 'Aqel', 'Rawand@gmail.com', 0, 'Rawand12345', 'Test', 'test', 1, '2025-03-19 02:21:40', '2025-03-19 05:04:39'),
(2, 'John', 'Doe', 'john.doe@example.com', 0, 'password123', 'https://example.com/john.jpg', 'https://facebook.com/john.doe', 2, '2025-03-19 05:16:20', '2025-03-19 05:16:20'),
(3, 'John', 'Doe', 'jane.smith@example.com', 0, 'password123', 'https://example.com/newphoto.jpg', 'https://facebook.com/john.doe', 2, '2025-03-19 05:17:42', '2025-05-02 00:38:50'),
(4, 'Rawand', 'Aqel', 'Rawand@example.com', 0, 'password123', 'https://example.com/jane.jpg', 'https://facebook.com/jane.smith', 4, '2025-04-29 13:52:48', '2025-04-29 13:52:48'),
(5, 'Michael', 'Johnson', 'michael.johnson@example.com', 0, 'securepass123', 'https://example.com/michael.jpg', 'https://facebook.com/michael.johnson', 2, '2025-04-29 13:55:57', '2025-04-29 13:55:57'),
(6, 'Sarah', 'Williams', 'sarah.williams@example.com', 0, 'sarahpass456', 'https://example.com/sarah.jpg', 'https://facebook.com/sarah.williams', 3, '2025-04-29 13:55:57', '2025-04-29 13:55:57'),
(7, 'David', 'Brown', 'david.brown@example.com', 0, 'davidpass789', 'https://example.com/david.jpg', 'https://facebook.com/david.brown', 1, '2025-04-29 13:55:57', '2025-04-29 13:55:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `recever_id` (`recever_id`);

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `company_feedback`
--
ALTER TABLE `company_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_application`
--
ALTER TABLE `job_application`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `pay_info`
--
ALTER TABLE `pay_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `position_category`
--
ALTER TABLE `position_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `position_company`
--
ALTER TABLE `position_company`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `position_category_id` (`position_category_id`);

--
-- Indexes for table `position_provider`
--
ALTER TABLE `position_provider`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_provider_id` (`service_provider_id`),
  ADD KEY `position_category_id` (`position_category_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `project_milestone`
--
ALTER TABLE `project_milestone`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `provider_feedback`
--
ALTER TABLE `provider_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `service_provider_id` (`service_provider_id`);

--
-- Indexes for table `provider_job`
--
ALTER TABLE `provider_job`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_application_id` (`job_application_id`),
  ADD KEY `provider_job_ibfk_3` (`provider_id`);

--
-- Indexes for table `provider_team`
--
ALTER TABLE `provider_team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_provider_id` (`service_provider_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `service_provider`
--
ALTER TABLE `service_provider`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_provider_id` (`service_provider_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `location_id` (`location_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `company_feedback`
--
ALTER TABLE `company_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `job_application`
--
ALTER TABLE `job_application`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pay_info`
--
ALTER TABLE `pay_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `position_category`
--
ALTER TABLE `position_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `position_company`
--
ALTER TABLE `position_company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `position_provider`
--
ALTER TABLE `position_provider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `project_milestone`
--
ALTER TABLE `project_milestone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `provider_feedback`
--
ALTER TABLE `provider_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `provider_job`
--
ALTER TABLE `provider_job`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `provider_team`
--
ALTER TABLE `provider_team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service_provider`
--
ALTER TABLE `service_provider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth`
--
ALTER TABLE `auth`
  ADD CONSTRAINT `auth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`recever_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `company_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `company_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_feedback`
--
ALTER TABLE `company_feedback`
  ADD CONSTRAINT `company_feedback_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_feedback_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD CONSTRAINT `company_settings_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_application`
--
ALTER TABLE `job_application`
  ADD CONSTRAINT `job_application_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_application_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `location`
--
ALTER TABLE `location`
  ADD CONSTRAINT `location_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pay_info`
--
ALTER TABLE `pay_info`
  ADD CONSTRAINT `pay_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `position_company`
--
ALTER TABLE `position_company`
  ADD CONSTRAINT `position_company_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `position_company_ibfk_2` FOREIGN KEY (`position_category_id`) REFERENCES `position_category` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `position_provider`
--
ALTER TABLE `position_provider`
  ADD CONSTRAINT `position_provider_ibfk_1` FOREIGN KEY (`service_provider_id`) REFERENCES `service_provider` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `position_provider_ibfk_2` FOREIGN KEY (`position_category_id`) REFERENCES `position_category` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_milestone`
--
ALTER TABLE `project_milestone`
  ADD CONSTRAINT `fk_milestone_project` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `provider_feedback`
--
ALTER TABLE `provider_feedback`
  ADD CONSTRAINT `provider_feedback_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `provider_feedback_ibfk_2` FOREIGN KEY (`service_provider_id`) REFERENCES `service_provider` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `provider_job`
--
ALTER TABLE `provider_job`
  ADD CONSTRAINT `provider_job_ibfk_2` FOREIGN KEY (`job_application_id`) REFERENCES `job_application` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `provider_job_ibfk_3` FOREIGN KEY (`provider_id`) REFERENCES `service_provider` (`id`);

--
-- Constraints for table `provider_team`
--
ALTER TABLE `provider_team`
  ADD CONSTRAINT `provider_team_ibfk_1` FOREIGN KEY (`service_provider_id`) REFERENCES `service_provider` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `provider_team_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_provider`
--
ALTER TABLE `service_provider`
  ADD CONSTRAINT `service_provider_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`service_provider_id`) REFERENCES `service_provider` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `team`
--
ALTER TABLE `team`
  ADD CONSTRAINT `team_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
