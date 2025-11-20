# Expense Tracker Dashboard (Java + Spring Boot)

A simple **expense tracking and analytics dashboard** built with:

- Java 17
- Spring Boot 3
- H2 database (file-based, no separate DB install needed)
- HTML + CSS + JavaScript (no frontend framework)
- Chart.js for charts

✅ Prerequisites

You need these installed:
	•	Git
	•	Java Development Kit (JDK) 17
	•	Check:

``` bash
java -version
```
Should show version 17.x (or higher, but project is compiled for 17).

	•	Maven 3.8+ (tested with 3.9.x)
	•	Check:

```bash
mvn -version
```
No external database is required – the app uses H2 and stores data in the local data/ folder.

🚀 How to Clone and Run (Other System)

1. Clone the repository
```bash
git clone https://github.com/manasmannu/Expense_Tracker.git
cd expense-tracker
```
2. Build the project

From the project root (where pom.xml is):
```bash
mvn clean install
```
This will:
	•	Download dependencies
	•	Compile the code
	•	Run basic tests

3. Run the application
```bash
mvn spring-boot:run
```
If startup is successful, you’ll see logs ending with something like:
```bash
Tomcat started on port 8080 (http) with context path '/'
Started ExpenseTrackerApplication ...
```
The backend + frontend are now running on:
	•	http://localhost:8080

🌐 Using the Web Dashboard

Open in your browser:
```bash
http://localhost:8080/index.html
```

You’ll see:
	•	Top summary cards → total spent, average daily spend, selected period
	•	Add New Expense form
	•	Filters by date range + category
	•	Charts
	•	Category-wise spending (pie)
	•	Daily spend (bar)
	•	Table of all expenses

Add an expense
	1.	Fill in:
	•	Description (e.g. Grocery shopping)
	•	Amount (₹)
	•	Category (e.g. Food / Rent / Travel)
	•	Date
	•	Optional: Payment method (UPI / Card / Cash)
	2.	Click “Add Expense”
	3.	The table and charts will refresh with the new data.

Filter expenses
	1.	Set Start Date, End Date, and/or Category
	2.	Click Apply Filters
	3.	Dashboard, charts, and table will update for that range.
	4.	Click Clear to reset filters.


📡 You can run the below commands to test the API Endpoints (for Postman / curl)

The backend exposes REST APIs under /api.

1. Create an expense
```bash
POST /api/expenses
Content-Type: application/json
```

Request body:
```bash
{
  "description": "Grocery shopping",
  "amount": 1500.50,
  "category": "Food",
  "date": "2025-01-10",
  "paymentMethod": "Card"
}
```

2. Get all expenses (with optional filters)
```bash
GET /api/expenses
GET /api/expenses?startDate=2025-01-01&endDate=2025-01-31
GET /api/expenses?category=Food
GET /api/expenses?startDate=2025-01-01&endDate=2025-01-31&category=Food
```

3. Get a single expense by ID
```bash
GET /api/expenses/{id}
```

4. Update an expense
```bash
PUT /api/expenses/{id}
Content-Type: application/json
```

5. Delete an expense
```bash
DELETE /api/expenses/{id}
```

6. Get analytics
```bash
GET /api/analytics
GET /api/analytics?startDate=2025-01-01&endDate=2025-01-31
```
Sample response:
```bash
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "totalAmount": 5400.75,
  "categoryTotals": {
    "Food": 2000.00,
    "Rent": 3000.00,
    "Travel": 400.75
  },
  "averageDailySpend": 174.22
}
```

🛠 DevTools (Auto-Reload During Development)

This project includes Spring Boot DevTools.

When running with:
```bash
mvn spring-boot:run
```

•	Changes to Java classes trigger an automatic restart.
•	Changes to src/main/resources/static (HTML/CSS/JS) cause the browser to refresh.

For best experience, enable Auto Save in your editor (VS Code: File → Auto Save).

🧪 H2 Database Console (Optional)

You can view the H2 database in the browser.
	1.	Start the app.
	2.	Go to:

```bash
http://localhost:8080/h2-console
```
3.	Use these settings:
	•	JDBC URL: jdbc:h2:file:./data/expense_tracker_db
	•	User: sa
	•	Password: (leave blank)

4.	Click Connect → query the EXPENSES table.
🧾 Tech Stack
	•	Backend: Java 17, Spring Boot 3.3.x, Spring Web, Spring Data JPA, Validation
	•	Database: H2 (file-based)
	•	Frontend: HTML, CSS, JavaScript, Chart.js
	•	Build Tool: Maven 3.8+
	•	Dev Tools: Spring Boot DevTools
