-- Run this in psql as a superuser to create the DB and user
CREATE USER homeschool_user WITH PASSWORD 'homeschool_pass';
CREATE DATABASE homeschool_db OWNER homeschool_user;
GRANT ALL PRIVILEGES ON DATABASE homeschool_db TO homeschool_user;
