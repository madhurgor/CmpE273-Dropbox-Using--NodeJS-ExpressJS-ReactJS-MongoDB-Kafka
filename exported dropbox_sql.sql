-- MySQL dump 10.13  Distrib 5.7.19, for Win32 (AMD64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `firstname` varchar(20) DEFAULT NULL,
  `lastname` varchar(20) DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `work` varchar(30) DEFAULT NULL,
  `education` varchar(30) DEFAULT NULL,
  `phone_no` varchar(30) DEFAULT NULL,
  `hobbies` varchar(30) DEFAULT NULL,
  `le` varchar(50) DEFAULT NULL,
  `interest` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('D P','Gor','d@g.c','$2a$10$Y2JhmTP217jv8hxq.ABXh.ODBpPhMN1WMMq.Y.ifP4BL7H4JTDLdC','HW','M.Sc','0','Reading','Joined Vanita Vishram in 2006','Music'),('D P','Gor','d@g.c1','$2a$10$xMhkS2siedo1gSRlOBSnjuNhl/C4AMA/uOaF25dBxb3Lez9DuKROO','HW','M.Sc B.Ed','0','Reading','Joined Vanita Vishram in 2006','Music '),('Madhur Pankajkumar','Gor','m@g.c','$2a$10$0iXluFEWTKiBdYqXHU1yXupaDtA1BiE4nCDOQvHlgqXGbNiSJ4ZB2','XYZ','MS in SE','0','Playing','Joined SJSU in 2017','Chess'),('Madhur Pankajkumar','Gor','m@g.c1','$2a$10$uAL9MkC.JBQGfUrpnaGnl.rtvpPuF4IrI8/rGtUsJgppoZ4Dd3W/.','Infosys','MS in SE','0','Playing','Joined SJSU in 2017','Chess'),('P P','Gor','p@g.c','$2a$10$UEvf5rpTq00wQsvNQnA7Au9pE7r60VAOPsP7gWFtO0WVwnsrao9li','XYZ','BE','0','Reading','Join GEB in 2000','Engineering'),('P P','Gor','p@g.c1','$2a$10$uoyJ7NKpJomrEDV3mUBJ/eANh7lNDV8..p5Y1FCTNDrpxPAvOccuW','GSFC','BE in EE','0','Reading','Join GEB in 2000','Engineering');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-15 23:17:54
