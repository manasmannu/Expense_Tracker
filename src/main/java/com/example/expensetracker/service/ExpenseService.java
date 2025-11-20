package com.example.expensetracker.service;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.model.ExpenseAnalytics;
import com.example.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.time.temporal.ChronoUnit;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses(LocalDate startDate, LocalDate endDate, String category) {
        if (startDate != null && endDate != null && category != null && !category.isBlank()) {
            return expenseRepository.findByCategoryAndDateBetween(category, startDate, endDate);
        } else if (startDate != null && endDate != null) {
            return expenseRepository.findByDateBetween(startDate, endDate);
        } else {
            return expenseRepository.findAll();
        }
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public Expense updateExpense(Long id, Expense updated) {
        return expenseRepository.findById(id)
                .map(existing -> {
                    existing.setDescription(updated.getDescription());
                    existing.setAmount(updated.getAmount());
                    existing.setCategory(updated.getCategory());
                    existing.setDate(updated.getDate());
                    existing.setPaymentMethod(updated.getPaymentMethod());
                    return expenseRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public ExpenseAnalytics getAnalytics(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1); // first day of current month
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
    
        List<Expense> expenses = expenseRepository.findByDateBetween(startDate, endDate);
    
        BigDecimal total = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    
        Map<String, BigDecimal> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));
    
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (days < 1) {
            days = 1;
        }
        BigDecimal avgDaily = days == 0
                ? BigDecimal.ZERO
                : total.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);
    
        return new ExpenseAnalytics(startDate, endDate, total, categoryTotals, avgDaily);
    }
}