CREATE DATABASE  IF NOT EXISTS `is421` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `is421`;
-- MySQL dump 10.13  Distrib 5.6.24, for osx10.8 (x86_64)
--
-- Host: 127.0.0.1    Database: is421
-- ------------------------------------------------------
-- Server version	5.6.22

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
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Project` (
  `projectId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
INSERT INTO `Project` VALUES (21,'House','Plans to build a house');
/*!40000 ALTER TABLE `Project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Task`
--

DROP TABLE IF EXISTS `Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Task` (
  `taskId` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'new',
  `description` varchar(1000) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `assigned_to` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_by` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`taskId`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Task`
--

LOCK TABLES `Task` WRITE;
/*!40000 ALTER TABLE `Task` DISABLE KEYS */;
INSERT INTO `Task` VALUES (37,21,'Blueprints','wip','Come up with blue prints','urvesh','urvesh','2015-12-04 20:34:12','2015-12-04 20:34:12','2015-12-04 15:34:12'),(38,21,'Buy plot','wip',NULL,'urvesh','urvesh','2015-12-04 20:34:12','2015-12-04 20:34:12','2015-12-04 15:34:12'),(39,21,'Get Loan','done',NULL,'urvesh','urvesh','2015-12-04 20:34:13','2015-12-04 20:34:13','2015-12-04 15:34:13'),(40,21,'Get Employees','new',NULL,'urvesh','urvesh','2015-12-04 20:31:50','2015-12-04 20:31:50','2015-12-04 15:31:43'),(41,21,'Start construction','new',NULL,'urvesh','urvesh','2015-12-04 20:32:06','2015-12-04 20:32:06','2015-12-25 15:31:52'),(42,21,'Gather tools','wip',NULL,'urvesh','tester','2015-12-04 20:34:29','2015-12-04 20:34:29','2015-12-04 15:34:29'),(43,21,'Buy machinery','new',NULL,'urvesh','tester','2015-12-04 20:32:41','2015-12-04 20:32:41','2015-12-11 15:32:20'),(44,21,'Research contractors','new',NULL,'urvesh','tester','2015-12-04 20:33:11','2015-12-04 20:33:11','2015-12-16 15:32:44'),(45,21,'Schedule deliveries','new',NULL,'urvesh','tester','2015-12-04 20:34:05','2015-12-04 20:34:05','2015-12-08 15:33:54'),(46,21,'Finish school','done',NULL,'urvesh','student','2015-12-04 20:35:29','2015-12-04 20:35:29','2015-12-04 15:35:29'),(47,21,'Get wood','wip',NULL,'urvesh','student','2015-12-04 20:35:27','2015-12-04 20:35:27','2015-12-04 15:35:27'),(48,21,'Buy plants','new',NULL,'urvesh','student','2015-12-04 20:35:22','2015-12-04 20:35:22','2015-12-25 15:34:55');
/*!40000 ALTER TABLE `Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `owner` varchar(50) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `confirmationCode` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (11,'urvesh','urvesh','patel','urvesh@is421.com','$2a$10$GdFcvElDm2KNCY7QPhQfFOz6LuHx1T6XSup2xw3dGj0j70m3S8r8C',1,NULL,1,'$2a$04$kMxMlnvTdIHP3q6A7A0Zdu7vlWkGewdmgudqe8sXgFdxwvLBx4xey'),(12,'david','David','G','david@is421.com','$2a$10$AzsAAwARNQb6ONlSmQHqmuf75.hTz3scqWsfqCloUtYN0Xt/UvTAi',1,NULL,1,'$2a$04$eHBcj1xLMs0wup/iHtCAXeq/dIIQHMwyde2EVBGiS2jSMb3s.uqd6'),(16,'admin','admin','admin','admin@is421.com','$2a$10$YLK50gruPS/2vIf4beYYhek9E8pfe7PLVL0m369fk9oU4zGA.XyGS',1,NULL,1,'$2a$04$HZwhexlghG06XDmUUbTznu5milUgFOPvOpRbLcli2cNeyfQQe0xie'),(17,'tester','Robert','Drayton','RobertRDrayton@jourrapide.com','$2a$10$YfC131iRMyaKlSaoWFc2EOuRWg/8.rL.o7xHShu3TSEmlVzswIMj2',0,'urvesh',1,'$2a$04$hDtol8CXA.VpXKlIWz6SEeD5/6HjkxZvVwQkCbSEtOmbDPRqhoKb6'),(18,'student','Adeline','Garcia','AdelineRGarcia@armyspy.com','$2a$10$J2rF1AiJgFNAeuYDIF00HeTUaIw7moRakKParyroZil7PBHo20Rby',0,'urvesh',1,'$2a$04$l.xNQvFrgCwG0koM9V.zCuE0QTyFtVQeC2bi/t9Hra2Sb83QRoYDi'),(19,'teacher','rob','hallock','RobEHallock@dayrep.com','$2a$10$g.RE0ufWZ2eX47e0FQzpneBLsTS3z9t29RtsonEVskb2gEkhb5rVy',0,'david',1,'$2a$04$EAxh3d/L7mbvJH0eDRltFe1ic.Kn/P9C8LKGxOfi8cYTH7fDWjQSe'),(20,'pandora','Karen','Dillon','KarenTDillon@rhyta.com','$2a$10$YFdqpzn/CJ8rbKYugLAiveoKYLhbU9pR1y7IrK/Q7bZQoOR7xWr8C',0,'david',1,'$2a$04$GwQf8Op7kg1VecBAi7kGIOXxkSTWhhw/XHwDs6F1G1SWPR6sVLVr2');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserProject`
--

DROP TABLE IF EXISTS `UserProject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserProject` (
  `upId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  PRIMARY KEY (`upId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserProject`
--

LOCK TABLES `UserProject` WRITE;
/*!40000 ALTER TABLE `UserProject` DISABLE KEYS */;
INSERT INTO `UserProject` VALUES (21,11,21);
/*!40000 ALTER TABLE `UserProject` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-04 15:37:43
