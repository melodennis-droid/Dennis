from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# --- FUNÇÃO PARA INICIAR O BANCO DE DADOS ---
def init_db():
    conn = sqlite3.connect('loja.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# --- CONEXÃO COM O BANCO ---
def get_db_connection():
    conn = sqlite3.connect('loja.db')
    conn.row_factory = sqlite3.Row
    return conn

# --- ROTAS (ENDPOINTS) ---

# Rota principal para carregar o seu site
@app.route('/')
def index():
    return render_template('index.html')

# Rota da API para receber os dados do formulário e salvar no SQLite
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, password))
        conn.commit()
        return jsonify({"status": "success", "message": f"Bem-vindo(a), {name}! Conta criada com sucesso."}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "Este e-mail já está cadastrado."}), 400
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)