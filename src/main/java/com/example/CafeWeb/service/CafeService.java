package com.example.CafeWeb.service;

import com.example.CafeWeb.model.CafeOrder;
import com.example.CafeWeb.model.MenuItem;
import com.example.CafeWeb.model.OrderLine;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class CafeService {

	private final AtomicInteger orderSequence = new AtomicInteger(1000);

	private final List<MenuItem> menu = List.of(
			new MenuItem("espresso", "Espresso", "Coffee", "Rich double shot with a clean finish.", new BigDecimal("6500"), "Strong", "ES", "#2f6f73"),
			new MenuItem("latte", "Vanilla Latte", "Coffee", "Steamed milk, espresso, vanilla cream.", new BigDecimal("9500"), "Favorite", "VL", "#d86c47"),
			new MenuItem("coldbrew", "Cold Brew", "Coffee", "Slow brewed coffee over ice.", new BigDecimal("10500"), "Iced", "CB", "#4a7c59"),
			new MenuItem("tea", "Berry Tea", "Tea", "Hibiscus, berries, honey and lemon.", new BigDecimal("8000"), "Fresh", "BT", "#9d4edd"),
			new MenuItem("matcha", "Matcha Cloud", "Tea", "Ceremonial matcha with soft milk foam.", new BigDecimal("11000"), "Creamy", "MC", "#5f8f4e"),
			new MenuItem("croissant", "Butter Croissant", "Bakery", "Flaky pastry baked each morning.", new BigDecimal("7500"), "Warm", "BC", "#e0a458"),
			new MenuItem("cheesecake", "Blueberry Cheesecake", "Bakery", "Cream cheese, biscuit base, blueberry compote.", new BigDecimal("12500"), "Slice", "CC", "#577590"),
			new MenuItem("sandwich", "Chicken Panini", "Food", "Grilled chicken, pesto, tomato and cheese.", new BigDecimal("16500"), "Lunch", "CP", "#ef476f")
	);

	public List<MenuItem> getMenu() {
		return menu;
	}

	public Map<String, List<MenuItem>> getMenuByCategory() {
		return menu.stream()
				.collect(Collectors.groupingBy(MenuItem::category, LinkedHashMap::new, Collectors.toList()));
	}

	public CafeOrder placeOrder(String customerName, String tableNumber, String note, Map<String, String> formValues) {
		String cleanCustomerName = clean(customerName);
		if (cleanCustomerName.isBlank()) {
			throw new IllegalArgumentException("Нэрээ оруулна уу.");
		}

		List<OrderLine> lines = new ArrayList<>();
		for (MenuItem item : menu) {
			int quantity = parseQuantity(formValues.get("qty_" + item.id()));
			if (quantity > 0) {
				lines.add(new OrderLine(item, quantity, item.price().multiply(BigDecimal.valueOf(quantity))));
			}
		}

		if (lines.isEmpty()) {
			throw new IllegalArgumentException("Дор хаяж нэг бүтээгдэхүүн сонгоно уу.");
		}

		BigDecimal total = lines.stream()
				.map(OrderLine::lineTotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		int waitMinutes = 6 + lines.stream().mapToInt(OrderLine::quantity).sum() * 2;

		return new CafeOrder(
				"CW-" + orderSequence.incrementAndGet(),
				cleanCustomerName,
				clean(tableNumber),
				clean(note),
				List.copyOf(lines),
				total,
				waitMinutes,
				LocalDateTime.now());
	}

	private int parseQuantity(String value) {
		if (value == null || value.isBlank()) {
			return 0;
		}

		try {
			int parsed = Integer.parseInt(value);
			return Math.max(0, Math.min(12, parsed));
		} catch (NumberFormatException ex) {
			return 0;
		}
	}

	private String clean(String value) {
		return value == null ? "" : value.trim();
	}
}
