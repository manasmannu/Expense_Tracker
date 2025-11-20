package com.example.expensetracker.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class ExpenseAnalytics {

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalAmount;
    private Map<String, BigDecimal> categoryTotals;
    private BigDecimal averageDailySpend;

    public ExpenseAnalytics() {
    }

    public ExpenseAnalytics(LocalDate startDate,
                            LocalDate endDate,
                            BigDecimal totalAmount,
                            Map<String, BigDecimal> categoryTotals,
                            BigDecimal averageDailySpend) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalAmount = totalAmount;
        this.categoryTotals = categoryTotals;
        this.averageDailySpend = averageDailySpend;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Map<String, BigDecimal> getCategoryTotals() {
        return categoryTotals;
    }

    public void setCategoryTotals(Map<String, BigDecimal> categoryTotals) {
        this.categoryTotals = categoryTotals;
    }

    public BigDecimal getAverageDailySpend() {
        return averageDailySpend;
    }

    public void setAverageDailySpend(BigDecimal averageDailySpend) {
        this.averageDailySpend = averageDailySpend;
    }
}