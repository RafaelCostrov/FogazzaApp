from flask import Flask, jsonify, render_template, session, redirect, url_for
from functools import wraps
from flask_cors import CORS
from route.fogazza_route import fogazza_bp
from route.atendimento_route import atendimento_bp

app = Flask(__name__)
CORS(app) 

app.register_blueprint(fogazza_bp)
app.register_blueprint(atendimento_bp)

if __name__ == '__main__':
    # Rodando SEM debug para melhor performance
    app.run(host='127.0.0.1', port=5000, debug=False, threaded=True)