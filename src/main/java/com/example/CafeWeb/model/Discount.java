package com.example.CafeWeb.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

public record Discount(String label, BigDecimal amount) {

	public static Discount none() {
		return new Discount("", BigDecimal.ZERO);
	}

	public static Discount percent(String label, BigDecimal subtotal, String percent) {
		BigDecimal rate = new BigDecimal(percent);
		return new Discount(label, subtotal.multiply(rate).setScale(0, RoundingMode.HALF_UP));
	}
}
