const API_BASE = ""; // same origin

let categoryChart = null;
let dailyChart = null;

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;

    document.getElementById("expense-form").addEventListener("submit", onAddExpense);
    document.getElementById("apply-filters").addEventListener("click", applyFilters);
    document.getElementById("clear-filters").addEventListener("click", clearFilters);

    const scrollBtn = document.getElementById("scroll-add-expense");
    if (scrollBtn) {
        scrollBtn.addEventListener("click", () => {
            document.getElementById("add-expense-section")
                .scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    loadExpenses();
    loadAnalytics();
});

async function onAddExpense(event) {
    event.preventDefault();
    const form = event.target;
    const messageSpan = document.getElementById("form-message");
    const btn = document.getElementById("add-expense-btn");
    const btnText = document.getElementById("add-expense-btn-text");
    const spinner = document.getElementById("add-expense-spinner");

    const data = {
        description: document.getElementById("description").value.trim(),
        amount: parseFloat(document.getElementById("amount").value),
        category: document.getElementById("category").value.trim(),
        date: document.getElementById("date").value,
        paymentMethod: document.getElementById("paymentMethod").value.trim()
    };

    if (!data.description || isNaN(data.amount) || !data.category || !data.date) {
        messageSpan.textContent = "Please fill all required fields.";
        messageSpan.style.color = "#dc2626";
        return;
    }

    try {
        // UI: loading state
        btn.disabled = true;
        spinner.hidden = false;
        btnText.textContent = "Saving...";

        const res = await fetch(`${API_BASE}/api/expenses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to create expense");

        form.reset();
        document.getElementById("date").value = new Date().toISOString().split("T")[0];

        messageSpan.textContent = "Expense added!";
        messageSpan.style.color = "#059669";

        await loadExpenses();
        await loadAnalytics();
    } catch (err) {
        console.error(err);
        messageSpan.textContent = "Error adding expense.";
        messageSpan.style.color = "#dc2626";
    } finally {
        btn.disabled = false;
        spinner.hidden = true;
        btnText.textContent = "Add Expense";
    }
}

async function loadExpenses(params = {}) {
    try {
        const url = new URL(`${API_BASE}/api/expenses`, window.location.origin);
        if (params.startDate) url.searchParams.append("startDate", params.startDate);
        if (params.endDate) url.searchParams.append("endDate", params.endDate);
        if (params.category) url.searchParams.append("category", params.category);

        const res = await fetch(url.toString());
        const data = await res.json();

        renderExpensesTable(data);
        renderDailyChart(data);
    } catch (err) {
        console.error("Error loading expenses:", err);
    }
}

async function loadAnalytics(params = {}) {
    try {
        const url = new URL(`${API_BASE}/api/analytics`, window.location.origin);
        if (params.startDate) url.searchParams.append("startDate", params.startDate);
        if (params.endDate) url.searchParams.append("endDate", params.endDate);

        const res = await fetch(url.toString());
        const data = await res.json();

        renderAnalytics(data);
        renderCategoryChart(data);
    } catch (err) {
        console.error("Error loading analytics:", err);
    }
}

function renderExpensesTable(expenses) {
    const tbody = document.querySelector("#expenses-table tbody");
    tbody.innerHTML = "";

    if (!Array.isArray(expenses) || expenses.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 6;
        td.textContent = "No expenses found.";
        td.style.textAlign = "center";
        tbody.appendChild(tr).appendChild(td);
        return;
    }

    expenses.forEach(exp => {
        const tr = document.createElement("tr");

        const idTd = document.createElement("td");
        idTd.textContent = exp.id ?? "";
        tr.appendChild(idTd);

        const descTd = document.createElement("td");
        descTd.textContent = exp.description ?? "";
        tr.appendChild(descTd);

        const amountTd = document.createElement("td");
        const n = Number(exp.amount ?? 0);
        amountTd.textContent = isNaN(n) ? "" : n.toFixed(2);
        tr.appendChild(amountTd);

        const catTd = document.createElement("td");
        catTd.textContent = exp.category ?? "";
        tr.appendChild(catTd);

        const dateTd = document.createElement("td");
        dateTd.textContent = exp.date ?? "";
        tr.appendChild(dateTd);

        const pmTd = document.createElement("td");
        pmTd.textContent = exp.paymentMethod ?? "";
        tr.appendChild(pmTd);

        tbody.appendChild(tr);
    });
}

function renderAnalytics(analytics) {
    if (!analytics) return;

    const periodText = document.getElementById("period-text");
    const totalAmount = document.getElementById("total-amount");
    const avgDaily = document.getElementById("avg-daily");

    periodText.textContent = `${analytics.startDate} → ${analytics.endDate}`;

    const total = Number(analytics.totalAmount ?? 0);
    totalAmount.textContent = isNaN(total) ? "0.00" : total.toFixed(2);

    const avg = Number(analytics.averageDailySpend ?? 0);
    avgDaily.textContent = isNaN(avg) ? "0.00" : avg.toFixed(2);
}

function renderCategoryChart(analytics) {
    const ctx = document.getElementById("categoryChart").getContext("2d");
    const categoryTotals = analytics.categoryTotals || {};
    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals).map(Number);

    if (categoryChart) categoryChart.destroy();

    if (labels.length === 0) {
        categoryChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["No data"],
                datasets: [{ data: [1] }]
            },
            options: {
                plugins: { legend: { display: false } }
            }
        });
        return;
    }

    categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [{ data: values }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

function renderDailyChart(expenses) {
    const ctx = document.getElementById("dailyChart").getContext("2d");
    if (!Array.isArray(expenses)) return;

    const map = new Map();
    expenses.forEach(exp => {
        if (!exp.date || exp.amount == null) return;
        const current = map.get(exp.date) || 0;
        map.set(exp.date, current + Number(exp.amount));
    });

    const dates = Array.from(map.keys()).sort();
    const values = dates.map(d => map.get(d));

    if (dailyChart) dailyChart.destroy();

    if (dates.length === 0) {
        dailyChart = new Chart(ctx, {
            type: "bar",
            data: { labels: ["No data"], datasets: [{ label: "Daily spend", data: [0] }] },
            options: { plugins: { legend: { display: false } } }
        });
        return;
    }

    dailyChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: dates,
            datasets: [{ label: "Daily spend", data: values }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { autoSkip: true, maxTicksLimit: 7 }
                }
            }
        }
    });
}

function applyFilters() {
    const startDate = document.getElementById("filter-start-date").value || null;
    const endDate = document.getElementById("filter-end-date").value || null;
    const category = document.getElementById("filter-category").value.trim() || null;

    const params = { startDate, endDate, category };
    loadExpenses(params);
    loadAnalytics({ startDate, endDate });
}

function clearFilters() {
    document.getElementById("filter-start-date").value = "";
    document.getElementById("filter-end-date").value = "";
    document.getElementById("filter-category").value = "";

    loadExpenses();
    loadAnalytics();
}