const categories = [
  "Food",
  "Entertainment",
  "Transportation",
  "Housing",
  "Utilities",
  "Healthcare",
  "Education",
  "Clothing",
  "Savings",
  "Miscellaneous",
];

const translations = {
  en: {
    "Expense Tracker 3000": "Expense Tracker 3000",
    Amount: "Amount",
    "Select Category": "Select Category",
    "Add Custom Category": "Add Custom Category",
    "Add Expense": "Add Expense",
    "Expense List": "Expense List",
    "Enter custom category": "Enter custom category",
    "Custom category added": "Custom category added",
    "Expense added successfully": "Expense added successfully",
  },
  ru: {
    "Expense Tracker 3000": "Трекер Расходов 3000",
    Amount: "Сумма",
    "Select Category": "Выберите Категорию",
    "Add Custom Category": "Добавить Свою Категорию",
    "Add Expense": "Добавить Расход",
    "Expense List": "Список Расходов",
    "Enter custom category": "Введите свою категорию",
    "Custom category added": "Пользовательская категория добавлена",
    "Expense added successfully": "Расход успешно добавлен",
  },
};

let currentLanguage = "en";

function translate(key) {
  return translations[currentLanguage][key] || key;
}

function updateLanguage() {
  document.querySelectorAll("[data-en]").forEach((elem) => {
    const key = elem.getAttribute(`data-${currentLanguage}`);
    if (elem.placeholder) {
      elem.placeholder = translate(key);
    } else {
      elem.textContent = translate(key);
    }
  });
}

function populateCategories() {
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = `<option value="">${translate(
    "Select Category"
  )}</option>`;
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

document
  .getElementById("languageSelect")
  .addEventListener("change", function () {
    currentLanguage = this.value;
    updateLanguage();
    populateCategories();
    updateExpenseList();
  });

document
  .getElementById("addCustomCategory")
  .addEventListener("click", function () {
    const customCategory = prompt(translate("Enter custom category"));
    if (customCategory && !categories.includes(customCategory)) {
      categories.push(customCategory);
      populateCategories();
      alert(translate("Custom category added"));
    }
  });

document
  .getElementById("expenseForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;

    const result = await eel.add_expense(date, amount, category)();

    showMessage(translate("Expense added successfully"));

    document.getElementById("date").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";

    updateExpenseList();
    updateExpenseChart();
  });

function showMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.style.position = "fixed";
  messageElement.style.top = "20px";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translateX(-50%)";
  messageElement.style.background = "#e94560";
  messageElement.style.color = "#fff";
  messageElement.style.padding = "10px 20px";
  messageElement.style.borderRadius = "5px";
  messageElement.style.zIndex = "1000";
  document.body.appendChild(messageElement);

  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 3000);
}

async function updateExpenseList() {
  const expenses = await eel.get_expenses()();
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = `<h2>${translate("Expense List")}</h2>`;

  expenses.forEach((expense) => {
    const expenseElement = document.createElement("p");
    expenseElement.textContent = `${expense.date} - $${expense.amount} - ${expense.category}`;
    expenseElement.classList.add("fade-in");
    expenseList.appendChild(expenseElement);
  });
}

async function updateExpenseChart() {
  const chartData = await eel.get_expense_chart()();
  const chartImage = document.getElementById("expenseChart");
  chartImage.src = `data:image/png;base64,${chartData}`;
  chartImage.classList.add("fade-in");
}

// Initialize
updateLanguage();
populateCategories();
updateExpenseList();
updateExpenseChart();
