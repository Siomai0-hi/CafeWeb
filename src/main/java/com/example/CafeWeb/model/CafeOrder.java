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
		BigDecimal total,
		int waitMinutes,
		LocalDateTime createdAt) {

	public String formattedTotal() {
		NumberFormat formatter = NumberFormat.getNumberInstance(Locale.US);
		return formatter.format(total) + " MNT";
	}

	public String formattedCreatedAt() {
		return createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
	}
}
