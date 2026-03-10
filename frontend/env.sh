#!/bin/sh
# Recreate config.js at runtime
echo "window.env = {" > /usr/share/nginx/html/config.js
echo "  API_URL: \"${API_URL:-http://localhost:}\"" >> /usr/share/nginx/html/config.js
echo "};" >> /usr/share/nginx/html/config.js
