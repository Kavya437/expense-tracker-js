let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget =
    JSON.parse(localStorage.getItem("budget")) || 0;
let hideMoney = false;
let expenseChart = null;

displayExpenses();
function setBudget() {

    const value =
        document.getElementById("budgetInput").value;

    budget = Number(value);

    localStorage.setItem(
        "budget",
        JSON.stringify(budget)
    );

    displayExpenses();

    document.getElementById("budgetInput").value = "";
}
function toggleMoneyVisibility() {

    hideMoney = !hideMoney;

    const button =
        document.getElementById("toggleMoneyBtn");

    if (hideMoney) {
        button.innerText =
            "👁 Show Amounts";
    }
    else {
        button.innerText =
            "👁 Hide Amounts";
    }

    displayExpenses();
}

function addExpense() {

    const name = document.getElementById("expenseName").value;
    const amount = document.getElementById("expenseAmount").value;
    const category = document.getElementById("expenseCategory").value;

    if (name === "" || amount === "") {
        alert("Enter all fields");
        return;
    }

    expenses.push({
        name,
        amount: Number(amount),
        category,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
}

function displayExpenses() {

    const list = document.getElementById("expenseList");

    list.innerHTML = "";

    let total = 0;
    let categoryTotals = {};

    if (expenses.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>No expenses yet 💸</h3>
                <p>Add your first expense above</p>
            </div>
        `;
    }

    expenses.forEach((expense, index) => {

        total += expense.amount;
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }

        categoryTotals[expense.category] += expense.amount;

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="expense-info">
                <strong>${expense.name}</strong>

                <small>
                ${expense.category}
                </small>

                <small>
                ${expense.date}
                </small>
            </div>

            <div class="expense-actions">
                <span class="amount">
                ${hideMoney ? "****" : `₹${expense.amount}`}
                 </span>
                <button class="delete-btn" onclick="deleteExpense(${index})">
                    🗑️
                </button>
            </div>
        `;

        list.appendChild(li);
    });

    document.getElementById("total").innerText =
        hideMoney ? "****" : total;
    document.getElementById("entries").innerText = expenses.length;
    document.getElementById("budget").innerText =
        hideMoney ? "****" : budget;
    const remaining = budget - total;

    document.getElementById("remaining").innerText =
        hideMoney ? "****" : remaining;
    let topCategory = "None";
    let maxAmount = 0;

    for (let category in categoryTotals) {

        if (categoryTotals[category] > maxAmount) {

            maxAmount = categoryTotals[category];

            topCategory =
                `${category} ₹${maxAmount}`;
        }
    }
    document.getElementById("topCategory").innerText =
        topCategory;

    const labels =
        Object.keys(categoryTotals);

    const values =
        Object.values(categoryTotals);

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx =
        document.getElementById("expenseChart");

    expenseChart =
        new Chart(ctx, {

            type: "pie",

            data: {

                labels: labels,

                datasets: [{

                    data: values

                }]
            }
        });


    let percentage = 0;

    if (budget > 0) {
        percentage = (total / budget) * 100;
    }

    document.getElementById("progressBar").style.width =
        percentage + "%";
    const progressBar =
        document.getElementById("progressBar");

    if (percentage < 80) {
        progressBar.style.background = "#22c55e";
    }
    else if (percentage < 100) {
        progressBar.style.background = "#facc15";
    }
    else {
        progressBar.style.background = "#ef4444";
    }
    const warning =
        document.getElementById("warningMessage");

    if (percentage < 80) {
        warning.innerText = "";
    }
    else if (percentage < 100) {
        warning.innerText =
            "⚠️ Warning: Budget usage above 80%";
    }
    else {
        warning.innerText =
            `🚨 Budget exceeded by ₹${total - budget}`;
    }

    document.getElementById("progressText").innerText =
        percentage.toFixed(1) + "% Used";
}

function deleteExpense(index) {

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
}
function exportCSV() {
    let csv =
        "Category,Name,Amount,Date\n";
        
    expenses.forEach(expense => {

        csv +=
            `${expense.category},${expense.name},${expense.amount},${expense.date}\n`;

    });
}