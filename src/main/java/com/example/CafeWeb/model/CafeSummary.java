package com.example.CafeWeb.model;

public record CafeSummary(
		String name,
		String openingHours,
		String location,
		String averagePrepTime,
		int categoryCount,
		int menuItemCount) {
}
