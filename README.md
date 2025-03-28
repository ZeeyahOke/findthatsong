# Find That Song

Find that song is a web application that helps users find songs by searching for lyrics. It is built with JavaScript and the Musixmatch API.

## Features

Features of the application include:
- Search for songs using lyrics
- Display song details, including title, artist, genre, and album
- View full lyrics on Musixmatch
- Responsive design
- Loading indicators and error handling
- Analytics tracking for deployed site

## Links

- Video: https://youtu.be/2puftlRWBZY
- Git repo: https://github.com/ZeeyahOke/findthatsong
- Website: www.zeeyahoke.tech

  
## Prerequisites

- A web browser (Chrome, Firefox, Safari, or Edge)
- A local development server (like Live Server in VS Code)
- A Musixmatch API key (sign up at [Musixmatch Developer Portal](https://developer.musixmatch.com/))
- A web server (Apache, Nginx, etc.)
- A load balancer (HAProxy, Nginx, etc.)

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/findthatsong.git
cd findthatsong
```

2. Replace the API key in `script.js` with your own Musixmatch API key:
```javascript
const apiKey = 'YOUR_API_KEY_HERE';
```

3. Start a local development server:
   - If using VS Code, install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"
   - Or use any other local development server of your choice

4. Open your browser and navigate to:
   - If using Live Server: `http://127.0.0.1:5500`
   - Or the URL provided by your local development server

## Deployment

### Web Server Setup (Nginx)

1. Install Nginx on your server:
```bash
sudo apt update
sudo apt install nginx
```

2. Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/findthatsong
```

3. Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/findthatsong;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

4. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/findthatsong /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. Deploy your application files:
```bash
sudo mkdir -p /var/www/findthatsong
sudo cp -r * /var/www/findthatsong/
sudo chown -R www-data:www-data /var/www/findthatsong
```

### Load Balancer Setup (HAProxy)

1. Install HAProxy:
```bash
sudo apt update
sudo apt install haproxy
```

2. Configure HAProxy:
```bash
sudo nano /etc/haproxy/haproxy.cfg
```

3. Add the following configuration:
```haproxy
global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend http-in
    bind *:80
    mode http
    default_backend servers

backend servers
    balance roundrobin
    server server1 192.168.1.10:80 check
    server server2 192.168.1.11:80 check
    server server3 192.168.1.12:80 check
```

4. Restart HAProxy:
```bash
sudo systemctl restart haproxy
```

## APIs Used

### Musixmatch API
- [Official Documentation](https://developer.musixmatch.com/documentation)
- Used for:
  - Searching songs by lyrics
  - Getting detailed track information
  - Accessing song metadata

### CORS Proxy
- [allorigins.win](https://allorigins.win/)
- Used to handle CORS issues during development
- Note: For production, consider setting up your own backend server

## Development Challenges & Solutions

1. **CORS Issues**
   - Challenge: Musixmatch API doesn't allow direct browser requests
   - Solution: Implemented CORS proxy for development
   - Future Improvement: Set up a backend server for production

2. **API Rate Limiting**
   - Challenge: Initial CORS proxy service had strict rate limits
   - Solution: Switched to allorigins.win with higher limits
   - Future Improvement: Implement proper rate limiting on backend

3. **Error Handling**
   - Challenge: API responses needed comprehensive error handling
   - Solution: Implemented detailed error logging and user-friendly messages

## Credits

- [Musixmatch](https://www.musixmatch.com/) - For providing the song database and API
- [allorigins.win](https://allorigins.win/) - For providing CORS proxy services
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - VS Code extension for local development


## Acknowledgments

- Thanks to the Musixmatch team for their excellent API documentation and support
- The open-source community for various tools and resources used in development 
