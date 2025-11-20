package com.example.expensetracker.controller;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.model.ExpenseAnalytics;
import com.example.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // allow all origins, so you can add FE later if you want
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // Create expense
    @PostMapping("/expenses")
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense) {
        Expense created = expenseService.createExpense(expense);
        return ResponseEntity.ok(created);
    }

    // Get all expenses (with optional filters)
    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getExpenses(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(required = false) String category
    ) {
        List<Expense> expenses = expenseService.getAllExpenses(startDate, endDate, category);
        return ResponseEntity.ok(expenses);
    }

    // Get single expense
    @GetMapping("/expenses/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update expense
    @PutMapping("/expenses/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense expense
    ) {
        Expense updated = expenseService.updateExpense(id, expense);
        return ResponseEntity.ok(updated);
    }

    // Delete expense
    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    // Analytics endpoint
    @GetMapping("/analytics")
    public ResponseEntity<ExpenseAnalytics> getAnalytics(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        ExpenseAnalytics analytics = expenseService.getAnalytics(startDate, endDate);
        return ResponseEntity.ok(analytics);
    }
}