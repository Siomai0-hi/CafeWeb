package com.example.CafeWeb.model;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public record MenuItem(
		String id,
		String name,
		String category,
		String description,
		BigDecimal price,
		String tag,
		String shortCode,
		String accentColor,
		String imageUrl,
		boolean popular) {

	public MenuItem(
			String id,
			String name,
			String category,
			String description,
			BigDecimal price,
			String tag,
			String shortCode,
			String accentColor) {
		this(id, name, category, description, price, tag, shortCode, accentColor, "", false);
	}

	public String formattedPrice() {
		NumberFormat formatter = NumberFormat.getNumberInstance(Locale.US);
		return formatter.format(price) + " MNT";
	}
}
