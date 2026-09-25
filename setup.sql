-- Optional PostgreSQL bootstrap example.
-- Choose a strong password yourself and do not commit the real value.
CREATE USER homeschool_user WITH PASSWORD 'CHANGE_ME_TO_A_STRONG_PASSWORD';
CREATE DATABASE homeschool_db OWNER homeschool_user;
GRANT ALL PRIVILEGES ON DATABASE homeschool_db TO homeschool_user;
