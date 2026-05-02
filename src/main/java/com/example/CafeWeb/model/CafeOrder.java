package com.example.CafeWeb.model;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

public record CafeOrder(
		String id,
		String customerName,
		String tableNumber,
		String note,
		List<OrderLine> lines,
		BigDecimal subtotal,
		BigDecimal discountAmount,
		String discountLabel,
		BigDecimal total,
		String paymentMethod,
		int waitMinutes,
		LocalDateTime createdAt) {

	public CafeOrder(
			String id,
			String customerName,
			String tableNumber,
			String note,
			List<OrderLine> lines,
			BigDecimal total,
			int waitMinutes,
			LocalDateTime createdAt) {
		this(id, customerName, tableNumber, note, lines, total, BigDecimal.ZERO, "", total, "Cash", waitMinutes, createdAt);
	}

	public String formattedSubtotal() {
		return formatMoney(subtotal);
	}

	public String formattedDiscountAmount() {
		return formatMoney(discountAmount);
	}

	public String formattedTotal() {
		return formatMoney(total);
	}

	public String formattedCreatedAt() {
		return createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
	}

	public boolean hasDiscount() {
		return discountAmount.compareTo(BigDecimal.ZERO) > 0;
	}

	private String formatMoney(BigDecimal amount) {
		NumberFormat formatter = NumberFormat.getNumberInstance(Locale.US);
		return formatter.format(amount) + " MNT";
	}
}
