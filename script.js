let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

displayExpenses();

function addExpense() {

    const name = document.getElementById("expenseName").value;
    const amount = document.getElementById("expenseAmount").value;

    if (name === "" || amount === "") {
        alert("Enter all fields");
        return;
    }

    expenses.push({
        name,
        amount: Number(amount),
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

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="expense-info">
                <strong>${expense.name}</strong>
                <small>${expense.date}</small>
            </div>

            <div class="expense-actions">
                <span class="amount">₹${expense.amount}</span>
                <button class="delete-btn" onclick="deleteExpense(${index})">
                    🗑️
                </button>
            </div>
        `;

        list.appendChild(li);
    });

    document.getElementById("total").innerText = total;
    document.getElementById("entries").innerText = expenses.length;
}

function deleteExpense(index) {

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
}