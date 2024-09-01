import sqlite3

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('expenses.db')
        self.cursor = self.conn.cursor()
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS expenses
            (id INTEGER PRIMARY KEY,
             date TEXT,
             amount REAL,
             category TEXT)
        ''')
        self.conn.commit()

    def add_expense(self, date, amount, category):
        self.cursor.execute('''
            INSERT INTO expenses (date, amount, category)
            VALUES (?, ?, ?)
        ''', (date, amount, category))
        self.conn.commit()

    def get_expenses(self):
        self.cursor.execute('SELECT * FROM expenses')
        columns = [column[0] for column in self.cursor.description]
        return [dict(zip(columns, row)) for row in self.cursor.fetchall()]