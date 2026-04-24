package com.example.CafeWeb.model;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public record OrderLine(MenuItem item, int quantity, BigDecimal lineTotal) {

	public String formattedLineTotal() {
		NumberFormat formatter = NumberFormat.getNumberInstance(Locale.US);
		return formatter.format(lineTotal) + " MNT";
	}
}
