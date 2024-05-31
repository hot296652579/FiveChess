-- 修改身份验证 和 密码 mysql_native_password ,caching_sha2_password(这是8.0新的验证方式)
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '11111111';

DROP TABLE IF EXISTS `games-users`;
CREATE TABLE `games-users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户uid',
  `uuid` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户uuid',
  `uname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户名',
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `ugender` int(1) DEFAULT 0 COMMENT '性别',
  `ubalance` int(11) DEFAULT 100 COMMENT '用户积分',
  `created_time` datetime DEFAULT NULL COMMENT '注册时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最近登录时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`uname`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='用户表';