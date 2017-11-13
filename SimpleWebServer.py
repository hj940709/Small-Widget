from flask import Flask
import sys

print("Root:",sys.argv[1])

app = Flask(__name__,static_folder=sys.argv[1])
@app.route("/<path:path>")
def static_file(path):
    return app.send_static_file(path)
@app.route("/")
def Index():
    return app.send_static_file("Index.html")
@app.route("/test")
def test():
    return "Hello World!"


if __name__ == "__main__":
    app.run(port=8080)