# app/server.py
from flask import Flask, request, render_template_string
from app.identifier import is_js_id

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html>
<head>
  <title>JS Identifier Checker</title>
</head>
<body>
  <h1>JS Identifier Checker</h1>
  <form method="POST">
    <input type="text" name="identifier" placeholder="enter identifier" required>
    <button type="submit">Check</button>
  </form>
  {% if result is not none %}
    <p><strong>{{ identifier }}</strong> is
    {% if result %}✅ VALID{% else %}❌ INVALID{% endif %}
    </p>
  {% endif %}
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    identifier = ""
    if request.method == "POST":
        identifier = request.form["identifier"]
        result = is_js_id(identifier)
    return render_template_string(HTML, result=result, identifier=identifier)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
