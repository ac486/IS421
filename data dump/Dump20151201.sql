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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
INSERT INTO `Project` VALUES (1,'Sample Test Project',NULL),(2,'New Project',NULL),(3,'New Project',NULL),(4,'ADmin\'s project',NULL),(6,'Hey',NULL),(15,'Project #2','Project data'),(16,'CS431','Class Project'),(17,'Test project','Something?');
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
  PRIMARY KEY (`taskId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Task`
--

LOCK TABLES `Task` WRITE;
/*!40000 ALTER TABLE `Task` DISABLE KEYS */;
INSERT INTO `Task` VALUES (8,1,'test','new',NULL,''),(18,6,'Hey','wip','Do something','urvesh'),(19,15,'Task #1','new',NULL,'urvesh'),(20,15,'Task #2','new','Fix bugs','urvesh'),(21,15,'UI','wip','Update UI to new color scheme','urvesh'),(22,15,'Screens','new','Create new screenshots','urvesh'),(23,15,'Code','done','Code some stuff for initial demo','urvesh'),(24,16,'Schedule Time','wip','Schedule time with group members','urvesh'),(25,16,'Location','done','PIck a location to meet','urvesh'),(26,16,'Idea','done','Decide the project idea','urvesh'),(27,16,'Create wireframes','new',NULL,'urvesh'),(28,16,'Designate Responsiblities','new',NULL,'urvesh'),(29,16,'Trello','new','Create trello board','urvesh'),(30,16,'Technologies','wip','Come up with technologies that will be used','urvesh'),(31,16,'Task Test','done','Do stuff','urvesh');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'urvesh','urvesh','patel','Hiche1986@cuvox.de','$2a$10$KJ.qGxnsaihR47HneRY3CubxyakDDEjFaEbjCB5UXDVqUbjD5EgJu',1,NULL,1,NULL),(2,'test','test','test','test@test.com','$2a$10$zHba3RwbNb1zOxWWeU6mte2STP0Z5VWmFMfxTGNnRyxgHNjDL3Dl2',0,'urvesh',1,'$2a$04$V0rzmalJojHWbEuuwki.Zesg7GRXMhZpO/EtY4fttuUNjWi1ZA5e.'),(3,'tester','tester','tester','soutrego@fakeinbox.com','$2a$10$exM1y5pIEpe5LX3ZPOQTze4ZgRrV3Va9p9BjUNsUDM1XOu6yVjezS',0,'urvesh',1,'$2a$04$JZmYwKPrSp8OcEHm2vX/UuETcEcTRaqyZ7LpUIwnnTU0AFol11AIC'),(4,'admin','admin','admin','admin@admin.com','$2a$10$h8o8TAoMw/3eQwGNdhFmYuOv9VrgOo2nYyYLn8RvORKYodhtxtmXe',1,NULL,1,'$2a$04$bvB5iONY3RaQjv44FgaGBe.aly6wG5v/lfR87gdYS/TsZe5Kqh9zu'),(5,'test50','test50','test50','nudusecrac@thrma.com','$2a$10$9HCtfhOusSNQxIos.kCvX.07GG5FOLAy/UCT4yNSjL3EARMTXbOlu',0,'admin',1,'$2a$04$nRh/U9Yirh82tNMK1X2qJutkaKJtsUMoAvLmBO7MOVMdDAJrizr8e'),(6,'randomguy1','hey','bob','sticlilith@thrma.com','$2a$10$IwGSrEuktQmgsQPuK4SMduoow.cpRq/udT/Rtfe1wBSsAEDf302fm',0,'urvesh',1,'$2a$04$KmH5KqOUnpyxvdW8zx2LLuyD5xPsohg.K/xp7yZk9Sz3xXD1g6Ndi'),(7,'randomguy2','hey','bob','cretrudrem@thrma.com','$2a$10$6e880ZEGKDpPCdcOiMbRZOojNci24G56uNx8EkXeBgfdVD7xgUaAK',1,NULL,1,'$2a$04$4EZS9Z40VeeX2l/zngyT1u2IwEfHLgXqtwip3qdRNGxrt.M.rlu4W'),(8,'randomguy2','123','123','cretrudrem@thrma.com','$2a$10$YiORxbEcshEwxkobbdDd2.63eSYOLGccKGES5v7b.jQ93IvAelTbm',1,NULL,1,'$2a$04$VT77oJRR5ymU/AclNwSwDuFvlno42vM./0kd2qGF3EyVblx6Diegi'),(10,'bob','bob','bob','bob@bob.com','$2a$10$94pt75Vbe0DUPD0wisdZqelF5EgKWCssCi3tBEnTqbSAnMeozFKU.',0,'admin',1,'$2a$04$wRfrhLxUm/5Z7Sbi5OjJrei8BdAUnZqtgWjCpy8/NlzeE8hxatvAm');
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserProject`
--

LOCK TABLES `UserProject` WRITE;
/*!40000 ALTER TABLE `UserProject` DISABLE KEYS */;
INSERT INTO `UserProject` VALUES (2,2,2),(4,4,4),(6,1,6),(15,1,15),(16,1,16),(17,1,17);
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

-- Dump completed on 2015-12-01 19:37:36
