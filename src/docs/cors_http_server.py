from http.server import SimpleHTTPRequestHandler
import socketserver

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', 'http://10.227.70.105:5173')
        self.send_header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        super().end_headers()

# 使用端口号和CORSRequestHandler启动服务器
with socketserver.TCPServer(("", 8000), CORSRequestHandler) as httpd:
    print("Server is running on port 8000")
    httpd.serve_forever()

