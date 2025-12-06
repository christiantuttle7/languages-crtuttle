# app.py - Web UI for plaintext password cracking (show attempts)

from flask import Flask, request, render_template_string
import subprocess

app = Flask(__name__)

HTML = """
<!doctype html>
<html>
<head>
    <title>Parallel Password Cracker</title>
    <style>
        body { font-family: Arial; max-width: 700px; margin: 30px auto; }
        label { display: block; margin-top: 12px; font-weight: bold; }
        input[type=text], input[type=number] {
          width: 100%; padding: 6px; margin-top: 4px;
        }
        button { margin-top: 15px; padding: 10px 20px; font-size: 1rem; }
        textarea {
          width: 100%; height: 350px; margin-top: 15px;
          font-family: monospace; white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <h2>Parallel Password Cracker</h2>

    <form method="POST">
        <label>Password (exactly 5 lowercase letters):</label>
        <input type="text" name="password" value="{{ password }}" required>

        <label>Number of Threads:</label>
        <input type="number" name="threads" value="{{ threads }}" min="1" max="64" required>

        <button type="submit">Start Cracking</button>
    </form>

    {% if output %}
    <h3>Cracking Output:</h3>
    <textarea readonly>{{ output }}</textarea>
    {% endif %}
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    output = ""
    password = request.form.get("password", "")
    threads = request.form.get("threads", "4")

    if request.method == "POST":
        try:
            result = subprocess.run(
                ["./crack", password, threads],
                capture_output=True,
                text=True
            )
            output = result.stdout
        except Exception as e:
            output = f"Error running program: {e}"

    return render_template_string(
        HTML,
        output=output,
        password=password,
        threads=threads
    )

if __name__ == "__main__":
    app.run(debug=True)
