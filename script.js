// ================================
// Expense Tracker - Part 3A
// ================================

// Load data from Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;

// HTML Elements
const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudget");
const budgetAmount = document.getElementById("budgetAmount");
const progressBar = document.getElementById("progressBar");
const budgetStatus = document.getElementById("budgetStatus");

// ================================
// Save Transactions
// ================================
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ================================
// Save Budget
// ================================
saveBudgetBtn.addEventListener("click", () => {

    budget = Number(budgetInput.value);

    localStorage.setItem("budget", budget);

    budgetAmount.textContent = "₹" + budget;

    updateDashboard();
});

// ================================
// Add Transaction
// ================================
form.addEventListener("submit", function(e){

    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    const transaction = {

        id: Date.now(),

        description,

        amount,

        date,

        category,

        type

    };

    transactions.push(transaction);

    saveTransactions();

    form.reset();

    displayTransactions();

    updateDashboard();

});

// ================================
// Delete Transaction
// ================================
function deleteTransaction(id){

    transactions = transactions.filter(item => item.id !== id);

    saveTransactions();

    displayTransactions();

    updateDashboard();

}

// ================================
// Display Transactions
// ================================
function displayTransactions(){

    transactionList.innerHTML = "";

    let keyword = searchInput.value.toLowerCase();

    let filter = filterSelect.value;

    let filtered = transactions.filter(item => {

        let matchSearch =
        item.description.toLowerCase().includes(keyword);

        let matchFilter =
        filter === "All" || item.type === filter;

        return matchSearch && matchFilter;

    });

    filtered.forEach(item=>{

        transactionList.innerHTML += `

        <tr>

        <td>${item.description}</td>

        <td>${item.category}</td>

        <td>${item.type}</td>

        <td>₹${item.amount}</td>

        <td>${item.date}</td>

        <td>

        <button class="delete-btn"
        onclick="deleteTransaction(${item.id})">

        Delete

        </button>

        </td>

        </tr>

        `;

    });

}

// ================================
// Dashboard Calculations
// ================================
function updateDashboard(){

    let income = 0;

    let expense = 0;

    transactions.forEach(item=>{

        if(item.type==="Income"){

            income += item.amount;

        }

        else{

            expense += item.amount;

        }

    });

    incomeEl.textContent = "₹" + income;

    expenseEl.textContent = "₹" + expense;

    balanceEl.textContent = "₹" + (income - expense);

    budgetAmount.textContent = "₹" + budget;

    updateBudget(expense);

}

// ================================
// Budget Progress
// ================================
function updateBudget(expense){

    if(budget <= 0){

        progressBar.style.width = "0%";

        budgetStatus.textContent =
        "Set a monthly budget.";

        return;

    }

    let percent = (expense / budget) * 100;

    if(percent > 100){

        percent = 100;

    }

    progressBar.style.width = percent + "%";

    if(expense > budget){

        progressBar.style.background = "#ef4444";

        budgetStatus.textContent =
        "Budget Exceeded!";

    }

    else{

        progressBar.style.background = "#22c55e";

        budgetStatus.textContent =
        "Remaining: ₹" + (budget - expense);

    }

}

// ================================
// Search
// ================================
searchInput.addEventListener("input", displayTransactions);

// ================================
// Filter
// ================================
filterSelect.addEventListener("change", displayTransactions);

// ================================
// Initial Load
// ================================
displayTransactions();

updateDashboard();
// ==========================================
// PART 3B-1
// Edit Transaction + Dark Mode
// ==========================================

let editId = null;

// -------------------------
// Edit Transaction
// -------------------------

function editTransaction(id) {

    const transaction = transactions.find(item => item.id === id);

    if (!transaction) return;

    document.getElementById("description").value = transaction.description;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("date").value = transaction.date;
    document.getElementById("category").value = transaction.category;
    document.getElementById("type").value = transaction.type;

    editId = id;

}

// -------------------------
// Modify Add Transaction
// -------------------------

form.addEventListener("submit", function(e){

    if(editId === null){
        return;
    }

    e.preventDefault();

    const transaction = transactions.find(item => item.id === editId);

    transaction.description = document.getElementById("description").value;
    transaction.amount = Number(document.getElementById("amount").value);
    transaction.date = document.getElementById("date").value;
    transaction.category = document.getElementById("category").value;
    transaction.type = document.getElementById("type").value;

    editId = null;

    saveTransactions();

    displayTransactions();

    updateDashboard();

    form.reset();

});
// ======================================
// PART 3B-2
// Charts
// ======================================

let pieChart;
let barChart;

// -----------------------------
// Update Charts
// -----------------------------
function updateCharts() {

    // Category Wise Expense
    let categoryData = {};

    // Monthly Expense
    let monthlyData = {
        Jan:0, Feb:0, Mar:0, Apr:0,
        May:0, Jun:0, Jul:0, Aug:0,
        Sep:0, Oct:0, Nov:0, Dec:0
    };

    transactions.forEach(item => {

        if(item.type === "Expense"){

            // Pie Chart Data

            if(categoryData[item.category]){

                categoryData[item.category] += item.amount;

            }else{

                categoryData[item.category] = item.amount;

            }

            // Bar Chart Data

            let month =
            new Date(item.date).toLocaleString('default',
            {month:'short'});

            monthlyData[month] += item.amount;

        }

    });

    createPieChart(categoryData);

    createBarChart(monthlyData);

}
// -----------------------------
// Pie Chart
// -----------------------------
function createPieChart(categoryData){

    const ctx =
    document.getElementById("pieChart");

    if(pieChart){

        pieChart.destroy();

    }

    pieChart = new Chart(ctx,{

        type:'pie',

        data:{

            labels:Object.keys(categoryData),

            datasets:[{

                data:Object.values(categoryData),

                backgroundColor:[

                    "#3b82f6",
                    "#22c55e",
                    "#ef4444",
                    "#f59e0b",
                    "#8b5cf6",
                    "#06b6d4",
                    "#ec4899"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    position:'bottom'
                }

            }

        }

    });

}
// -----------------------------
// Bar Chart
// -----------------------------
function createBarChart(monthlyData){

    const ctx =
    document.getElementById("barChart");

    if(barChart){

        barChart.destroy();

    }

    barChart = new Chart(ctx,{

        type:'bar',

        data:{

            labels:Object.keys(monthlyData),

            datasets:[{

                label:"Expenses",

                data:Object.values(monthlyData),

                backgroundColor:"#3b82f6"

            }]

        },

        options:{

            responsive:true,

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}
updateCharts();
budgetAmount.textContent = "₹" + budget;

updateBudget(expense);

updateCharts();
function deleteTransaction(id){

    if(!confirm("Delete this transaction?")){
        return;
    }

    transactions = transactions.filter(item => item.id !== id);

    saveTransactions();

    displayTransactions();

    updateDashboard();

}