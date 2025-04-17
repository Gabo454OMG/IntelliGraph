from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time
import logging

app = Flask(__name__, static_folder='../fe/react_vite/dist')
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API endpoint for chat
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json

    if not data or 'message' not in data:
        return jsonify({'Error': 'Invalid request. Message not found.'}), 400
    
    user_message = data['message']
    logger.info(f"Received message: {user_message}")

    response = handle_message(user_message)

    return jsonify({'reply': response})

def handle_message(message):
    # Handle the message here and change the return statement
    time.sleep(0.5)
    return f"Your message was received: {message}"

# Serve React files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)