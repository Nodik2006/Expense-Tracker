import eel
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from database import Database

db = Database()

eel.init('web')

@eel.expose
def add_expense(date, amount, category):
    db.add_expense(date, float(amount), category)
    return "Expense added successfully!"

@eel.expose
def get_expenses():
    return db.get_expenses()

@eel.expose
def get_expense_chart():
    expenses = db.get_expenses()
    df = pd.DataFrame(expenses)
    
    plt.figure(figsize=(10, 6))
    plt.style.use('dark_background')  # Use a dark theme for the chart
    df.groupby('category')['amount'].sum().plot(kind='pie', autopct='%1.1f%%')
    plt.title('Expenses by Category', color='white')
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
    
    buffer = BytesIO()
    plt.savefig(buffer, format='png', transparent=True)
    buffer.seek(0)
    image_png = buffer.getvalue()
    buffer.close()
    
    graphic = base64.b64encode(image_png).decode('utf-8')
    return graphic

eel.start('index.html', size=(800, 600))