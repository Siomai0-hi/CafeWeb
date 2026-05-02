package com.example.CafeWeb.service;

import com.example.CafeWeb.model.CafeOrder;
import com.example.CafeWeb.model.CafeSummary;
import com.example.CafeWeb.model.Discount;
import com.example.CafeWeb.model.MenuItem;
import com.example.CafeWeb.model.OrderLine;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
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
			item("espresso", "Espresso", "Hot Drinks", "Rich double shot with a clean finish.", 6500,
					"Strong", "ES", "#f59e0b", "photo-1510707577719-ae7c14805e3a", true),
			item("latte", "Vanilla Latte", "Hot Drinks", "Steamed milk, espresso, vanilla cream.", 9500,
					"Favorite", "VL", "#d86c47", "photo-1509042239860-f550ce710b93", true),
			item("matcha", "Matcha Cloud", "Hot Drinks", "Ceremonial matcha with soft milk foam.", 11000,
					"Creamy", "MC", "#5f8f4e", "photo-1536256263959-770b48d82b0a", false),
			item("tea", "Berry Tea", "Hot Drinks", "Hibiscus, berries, honey and lemon.", 8000,
					"Fresh", "BT", "#9d4edd", "photo-1544787219-7f47ccb76574", false),
			item("coldbrew", "Cold Brew", "Cold Drinks", "Slow brewed coffee served over ice.", 10500,
					"Iced", "CB", "#22d3ee", "photo-1461023058943-07fcbe16d735", true),
			item("smoothie", "Mango Smoothie", "Cold Drinks", "Bright mango blend with a silky body.", 9000,
					"Fruit", "MS", "#4ade80", "photo-1505252585461-04db1eb84625", false),
			item("oreoshake", "Oreo Shake", "Cold Drinks", "Cookies, cream, and a thick chilled texture.", 10000,
					"Sweet", "OS", "#a78bfa", "photo-1572490122747-3968b75cc699", true),
			item("cheesecake", "Blueberry Cheesecake", "Desserts", "Cream cheese, biscuit base, blueberry compote.", 12500,
					"Slice", "CC", "#fb7185", "photo-1533134242443-d4fd215305ad", true),
			item("croissant", "Butter Croissant", "Desserts", "Flaky pastry warmed before serving.", 7500,
					"Warm", "BC", "#e0a458", "photo-1555507036-ab1f4038808a", false),
			item("tiramisu", "Tiramisu Cup", "Desserts", "Coffee-soaked dessert with mascarpone cream.", 9800,
					"Cup", "TC", "#f97316", "photo-1571877227200-a0d98ea607e9", false),
			item("sandwich", "Chicken Panini", "Breakfast", "Grilled chicken, pesto, tomato and cheese.", 16500,
					"Lunch", "CP", "#ef476f", "photo-1528736235302-52922df5c122", true),
			item("toast", "Avocado Toast", "Breakfast", "Creamy avocado over crisp toast.", 11500,
					"Morning", "AT", "#34d399", "photo-1525351484163-7529414344d8", false)
	);

	private static MenuItem item(
			String id,
			String name,
			String category,
			String description,
			int price,
			String tag,
			String shortCode,
			String accentColor,
			String imageId,
			boolean popular) {
		return new MenuItem(
				id,
				name,
				category,
				description,
				BigDecimal.valueOf(price),
				tag,
				shortCode,
				accentColor,
				"https://images.unsplash.com/" + imageId + "?auto=format&fit=crop&w=900&q=80",
				popular);
	}

	public List<MenuItem> getMenu() {
		return menu;
	}

	public Map<String, List<MenuItem>> getMenuByCategory() {
		return menu.stream()
				.collect(Collectors.groupingBy(MenuItem::category, LinkedHashMap::new, Collectors.toList()));
	}

	public List<MenuItem> getPopularItems() {
		return menu.stream()
				.filter(MenuItem::popular)
				.limit(4)
				.toList();
	}

	public CafeSummary getSummary() {
		return new CafeSummary(
				"CafeWeb",
				"07:00 - 21:00",
				"Sukhbaatar Square, Peace Avenue, Bayangol District",
				"8-18 minutes",
				getMenuByCategory().size(),
				menu.size());
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

		BigDecimal subtotal = lines.stream()
				.map(OrderLine::lineTotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		Discount discount = calculateDiscount(subtotal, LocalDate.now());
		BigDecimal total = subtotal.subtract(discount.amount());

		int itemCount = lines.stream().mapToInt(OrderLine::quantity).sum();
		int waitMinutes = Math.min(30, 6 + itemCount * 2);
		String paymentMethod = cleanPaymentMethod(formValues.get("paymentMethod"));

		return new CafeOrder(
				"CW-" + orderSequence.incrementAndGet(),
				cleanCustomerName,
				clean(tableNumber),
				clean(note),
				List.copyOf(lines),
				subtotal,
				discount.amount(),
				discount.label(),
				total,
				paymentMethod,
				waitMinutes,
				LocalDateTime.now());
	}

	public Discount calculateDiscount(BigDecimal subtotal, LocalDate date) {
		if (date.getMonthValue() == 2 && date.getDayOfMonth() == 14) {
			return Discount.percent("Valentine's Day", subtotal, "0.30");
		}

		if (date.getDayOfMonth() >= 29 && date.getDayOfMonth() <= 31
				&& date.getDayOfWeek() == DayOfWeek.FRIDAY) {
			return Discount.percent("Black Friday", subtotal, "0.20");
		}

		if (subtotal.compareTo(new BigDecimal("50000")) >= 0) {
			return Discount.percent("Order over 50,000", subtotal, "0.10");
		}

		return Discount.none();
	}

	private int parseQuantity(String value) {
		if (value == null || value.isBlank()) {
			return 0;
		}

		try {
			int parsed = Integer.parseInt(value);
			return Math.max(0, Math.min(20, parsed));
		} catch (NumberFormatException ex) {
			return 0;
		}
	}

	private String cleanPaymentMethod(String value) {
		String paymentMethod = clean(value);
		if (paymentMethod.isBlank()) {
			return "Cash";
		}
		return switch (paymentMethod) {
			case "Cash", "Card", "QPay", "SocialPay" -> paymentMethod;
			default -> "Cash";
		};
	}

	private String clean(String value) {
		return value == null ? "" : value.trim();
	}
}
