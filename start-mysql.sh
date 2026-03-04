#!/bin/bash
# Start MySQL (Anaconda) — run this if MySQL is not running
if lsof -i :3306 | grep -q LISTEN; then
  echo "MySQL is already running on port 3306"
else
  mysqld --datadir=/opt/anaconda3/var/mysql --socket=/tmp/mysql.sock --port=3306 &
  sleep 3
  echo "MySQL started on port 3306"
fi
