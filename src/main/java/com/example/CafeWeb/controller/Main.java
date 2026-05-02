package com.example.CafeWeb.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Scanner;

abstract class CafeProduct {
	private final String name;
	private final int basePrice;

	CafeProduct(String name, int basePrice) {
		this.name = name;
		this.basePrice = basePrice;
	}

	String getName() {
		return name;
	}

	int getBasePrice() {
		return basePrice;
	}

	abstract int price(String size, boolean hasIce);

	int priceWithSize(String size, int mediumExtra, int largeExtra) {
		return switch (size.toUpperCase(Locale.ROOT)) {
			case "M" -> basePrice + mediumExtra;
			case "L" -> basePrice + largeExtra;
			default -> basePrice;
		};
	}
}

class Coffee extends CafeProduct {
	Coffee(String name, int basePrice) {
		super(name, basePrice);
	}

	@Override
	int price(String size, boolean hasIce) {
		return priceWithSize(size, 2000, 4000) + (hasIce ? 500 : 0);
	}
}

class Tea extends CafeProduct {
	Tea(String name, int basePrice) {
		super(name, basePrice);
	}

	@Override
	int price(String size, boolean hasIce) {
		return priceWithSize(size, 1500, 3000) + (hasIce ? 500 : 0);
	}
}

class Milkshake extends CafeProduct {
	Milkshake(String name, int basePrice) {
		super(name, basePrice);
	}

	@Override
	int price(String size, boolean hasIce) {
		return priceWithSize(size, 2000, 4000) + (hasIce ? 500 : 0);
	}
}

class Smoothie extends CafeProduct {
	Smoothie(String name, int basePrice) {
		super(name, basePrice);
	}

	@Override
	int price(String size, boolean hasIce) {
		return priceWithSize(size, 2000, 4000) + (hasIce ? 500 : 0);
	}
}

class Dessert extends CafeProduct {
	Dessert(String name, int basePrice) {
		super(name, basePrice);
	}

	@Override
	int price(String size, boolean hasIce) {
		return priceWithSize(size, 1500, 3000);
	}
}

class Breakfast extends CafeProduct {
	Breakfast(String name, int basePrice) {
		super(name, basePrice);
	}

	@Override
	int price(String size, boolean hasIce) {
		return priceWithSize(size, 1500, 3000);
	}
}

record ProductSeed(String name, int basePrice) {
}

record CartItem(String category, String name, String size, boolean hasIce, int quantity, int unitPrice) {
	int total() {
		return quantity * unitPrice;
	}
}

record DiscountResult(String label, int amount) {
}

@FunctionalInterface
interface ProductFactory {
	CafeProduct create(String name, int basePrice);
}

enum Category {
	COFFEE(1, "Coffee", "Coffee.txt", true, Coffee::new, List.of(
			new ProductSeed("Latte", 12000),
			new ProductSeed("Americano", 10000),
			new ProductSeed("Cappuccino", 13000),
			new ProductSeed("Espresso", 8000),
			new ProductSeed("Mocha", 14000))),
	TEA(2, "Tea", "Tea.txt", true, Tea::new, List.of(
			new ProductSeed("Green Tea", 5000),
			new ProductSeed("Milk Tea", 7000),
			new ProductSeed("Lemon Tea", 6500),
			new ProductSeed("Ice Tea", 6000),
			new ProductSeed("Black Tea", 5000))),
	MILKSHAKE(3, "Milkshake", "Milkshake.txt", true, Milkshake::new, List.of(
			new ProductSeed("Vanilla", 9000),
			new ProductSeed("Chocolate", 9500),
			new ProductSeed("Strawberry", 8700),
			new ProductSeed("Oreo", 10000),
			new ProductSeed("Caramel", 9500))),
	SMOOTHIE(4, "Smoothie", "Smoothie.txt", true, Smoothie::new, List.of(
			new ProductSeed("Mango", 8000),
			new ProductSeed("Strawberry", 8500),
			new ProductSeed("Blueberry", 9000),
			new ProductSeed("Cranberry", 9500),
			new ProductSeed("Blackberry", 9000))),
	DESSERT(5, "Dessert", "Dessert.txt", false, Dessert::new, List.of(
			new ProductSeed("Cheesecake", 10000),
			new ProductSeed("Brownie", 9000),
			new ProductSeed("Chocolate Cake", 8500),
			new ProductSeed("Tiramisu", 8700),
			new ProductSeed("Croissant", 7000))),
	BREAKFAST(6, "Breakfast", "Breakfast.txt", false, Breakfast::new, List.of(
			new ProductSeed("Egg Sandwich", 8000),
			new ProductSeed("English Breakfast", 12000),
			new ProductSeed("Pancake", 9500),
			new ProductSeed("Avocado Toast", 11500),
			new ProductSeed("Omelette", 10000)));

	private final int option;
	private final String label;
	private final String fileName;
	private final boolean supportsIce;
	private final ProductFactory factory;
	private final List<ProductSeed> defaultItems;

	Category(int option, String label, String fileName, boolean supportsIce, ProductFactory factory,
			List<ProductSeed> defaultItems) {
		this.option = option;
		this.label = label;
		this.fileName = fileName;
		this.supportsIce = supportsIce;
		this.factory = factory;
		this.defaultItems = defaultItems;
	}

	int getOption() {
		return option;
	}

	String getLabel() {
		return label;
	}

	String getFileName() {
		return fileName;
	}

	boolean supportsIce() {
		return supportsIce;
	}

	CafeProduct createProduct(String name, int basePrice) {
		return factory.create(name, basePrice);
	}

	List<ProductSeed> getDefaultItems() {
		return defaultItems;
	}

	static Category fromOption(int option) {
		for (Category category : values()) {
			if (category.option == option) {
				return category;
			}
		}
		throw new IllegalArgumentException("Unknown category: " + option);
	}
}

class Discount {
	static DiscountResult apply(int total) {
		LocalDate today = LocalDate.now();

		if (today.getMonthValue() == 2 && today.getDayOfMonth() == 14) {
			return new DiscountResult("Valentine's Day 30% off", (int) Math.round(total * 0.30));
		}

		if (today.getDayOfMonth() >= 29 && today.getDayOfMonth() <= 31
				&& today.getDayOfWeek() == DayOfWeek.FRIDAY) {
			return new DiscountResult("Black Friday 20% off", (int) Math.round(total * 0.20));
		}

		if (total >= 50000) {
			return new DiscountResult("Order over 50000 10% off", (int) Math.round(total * 0.10));
		}

		return new DiscountResult("No discount", 0);
	}
}

class MenuFileManager {
	private static final Path MENU_DIR = Path.of("menu-data");
	private static final Path FEEDBACK_FILE = MENU_DIR.resolve("Feedback.txt");

	static List<CafeProduct> load(Category category) {
		Path file = MENU_DIR.resolve(category.getFileName());
		ensureMenuFile(file, category);

		List<CafeProduct> items = new ArrayList<>();
		try (BufferedReader reader = Files.newBufferedReader(file)) {
			String line;
			while ((line = reader.readLine()) != null) {
				String[] parts = line.split(",");
				if (parts.length != 2) {
					continue;
				}

				String name = parts[0].trim();
				int basePrice = Integer.parseInt(parts[1].trim());
				if (!name.isBlank() && basePrice > 0) {
					items.add(category.createProduct(name, basePrice));
				}
			}
		} catch (IOException | NumberFormatException ex) {
			System.out.println("Could not read " + file + ". Default menu will be used.");
			items = defaultProducts(category);
		}

		return items.isEmpty() ? defaultProducts(category) : items;
	}

	static void append(Category category, CafeProduct product) {
		Path file = MENU_DIR.resolve(category.getFileName());
		ensureMenuFile(file, category);

		try (BufferedWriter writer = Files.newBufferedWriter(file, java.nio.file.StandardOpenOption.APPEND)) {
			writer.newLine();
			writer.write(product.getName() + ", " + product.getBasePrice());
		} catch (IOException ex) {
			System.out.println("Could not save item to " + file + ".");
		}
	}

	static void appendFeedback(String customerName, String text) {
		try {
			Files.createDirectories(MENU_DIR);
			try (BufferedWriter writer = Files.newBufferedWriter(
					FEEDBACK_FILE,
					java.nio.file.StandardOpenOption.CREATE,
					java.nio.file.StandardOpenOption.APPEND)) {
				writer.write(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
				writer.write(" | ");
				writer.write(customerName);
				writer.write(" | ");
				writer.write(text);
				writer.newLine();
			}
		} catch (IOException ex) {
			System.out.println("Could not save feedback to " + FEEDBACK_FILE + ".");
		}
	}

	private static void ensureMenuFile(Path file, Category category) {
		try {
			Files.createDirectories(MENU_DIR);
			if (Files.notExists(file) || Files.size(file) == 0) {
				try (BufferedWriter writer = Files.newBufferedWriter(file)) {
					for (ProductSeed item : category.getDefaultItems()) {
						writer.write(item.name() + ", " + item.basePrice());
						writer.newLine();
					}
				}
			}
		} catch (IOException ex) {
			System.out.println("Could not prepare " + file + ".");
		}
	}

	private static List<CafeProduct> defaultProducts(Category category) {
		return category.getDefaultItems().stream()
				.map(item -> category.createProduct(item.name(), item.basePrice()))
				.toList();
	}
}

public class Main {
	private static final Scanner SCANNER = new Scanner(System.in);
	private static final Map<Category, List<CafeProduct>> MENU = new EnumMap<>(Category.class);
	private static int orderSequence = 1000;

	public static void main(String[] args) {
		loadAllMenus();
		System.out.println("Welcome to CafeWeb!");

		int choice;
		do {
			printMainMenu();
			choice = readInt("Choice: ", 1, 6);

			switch (choice) {
				case 1 -> order();
				case 2 -> addNewItem();
				case 3 -> openingHours();
				case 4 -> location();
				case 5 -> feedback();
				case 6 -> System.out.println("\nThank you! Goodbye!");
				default -> throw new IllegalStateException("Unexpected value: " + choice);
			}
		} while (choice != 6);
	}

	private static void loadAllMenus() {
		MENU.clear();
		for (Category category : Category.values()) {
			MENU.put(category, MenuFileManager.load(category));
		}
	}

	private static void printMainMenu() {
		System.out.println("\n+---------------------+");
		System.out.println("|      MAIN MENU      |");
		System.out.println("+---------------------+");
		System.out.println("| 1. Order            |");
		System.out.println("| 2. Add new item     |");
		System.out.println("| 3. Opening hours    |");
		System.out.println("| 4. Location         |");
		System.out.println("| 5. Feedback         |");
		System.out.println("| 6. Exit             |");
		System.out.println("+---------------------+");
	}

	private static void order() {
		List<CartItem> cart = new ArrayList<>();
		String customerName = readRequiredText("Customer name: ");
		boolean orderMore;

		do {
			Category category = chooseCategory();
			List<CafeProduct> products = MENU.getOrDefault(category, List.of());

			if (products.isEmpty()) {
				System.out.println("No items in this category yet.");
				return;
			}

			printProducts(category, products);
			int productIndex = readInt("Select item: ", 1, products.size()) - 1;
			CafeProduct product = products.get(productIndex);
			String size = readSize();
			boolean hasIce = category.supportsIce() && readYesNo("Add ice? (y/n): ");
			int quantity = readInt("Quantity: ", 1, 50);
			int unitPrice = product.price(size, hasIce);

			cart.add(new CartItem(category.getLabel(), product.getName(), size, hasIce, quantity, unitPrice));
			System.out.println("Added: " + product.getName() + " x" + quantity + " = " + formatMoney(unitPrice * quantity));

			orderMore = readYesNo("Order more? (y/n): ");
		} while (orderMore);

		printReceipt(customerName, cart);
	}

	private static Category chooseCategory() {
		System.out.println("\n--- CATEGORY ---");
		for (Category category : Category.values()) {
			int count = MENU.getOrDefault(category, List.of()).size();
			System.out.printf(" %d. %-10s (%d items)%n", category.getOption(), category.getLabel(), count);
		}
		return Category.fromOption(readInt("Select category: ", 1, Category.values().length));
	}

	private static void printProducts(Category category, List<CafeProduct> products) {
		System.out.println("\n--- " + category.getLabel().toUpperCase(Locale.ROOT) + " ---");
		for (int i = 0; i < products.size(); i++) {
			CafeProduct product = products.get(i);
			System.out.printf("%d. %s - %s%n", i + 1, product.getName(), formatMoney(product.getBasePrice()));
		}
	}

	private static void printReceipt(String customerName, List<CartItem> cart) {
		int subtotal = 0;

		System.out.println("\n+---------------------------+");
		System.out.println("|       ORDER SUMMARY       |");
		System.out.println("+---------------------------+");
		for (CartItem item : cart) {
			subtotal += item.total();
			String iceText = item.hasIce() ? ", ice" : "";
			System.out.printf("  %s [%s%s] x%d = %s%n",
					item.name(), item.size(), iceText, item.quantity(), formatMoney(item.total()));
		}

		String payment = choosePayment();
		DiscountResult discount = Discount.apply(subtotal);
		int finalTotal = subtotal - discount.amount();
		int itemCount = cart.stream().mapToInt(CartItem::quantity).sum();
		int waitMinutes = Math.min(30, 6 + itemCount * 2);
		String orderId = "CW-" + (++orderSequence);
		String orderedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

		System.out.println("\n+-------------------+");
		System.out.println("|      RECEIPT      |");
		System.out.println("+-------------------+");
		System.out.println("  Order ID: " + orderId);
		System.out.println("  Customer: " + customerName);
		System.out.println("  Payment: " + payment);
		System.out.println("  Subtotal: " + formatMoney(subtotal));
		if (discount.amount() > 0) {
			System.out.println("  " + discount.label() + ": -" + formatMoney(discount.amount()));
		}
		System.out.println("  Amount due: " + formatMoney(finalTotal));
		System.out.println("  Ordered at: " + orderedAt);
		System.out.println("  Ready in: " + waitMinutes + " minutes");
		System.out.println("  Thank you for your order!");
	}

	private static String choosePayment() {
		System.out.println("\n--- PAYMENT ---");
		System.out.println(" 1. Cash");
		System.out.println(" 2. Card");
		System.out.println(" 3. QPay");
		System.out.println(" 4. SocialPay");

		return switch (readInt("Select payment: ", 1, 4)) {
			case 1 -> "Cash";
			case 2 -> "Card";
			case 3 -> "QPay";
			case 4 -> "SocialPay";
			default -> throw new IllegalStateException("Unexpected payment");
		};
	}

	private static void addNewItem() {
		System.out.println("\n--- ADD NEW ITEM ---");
		Category category = chooseCategory();
		String itemName = readRequiredText("Item name: ");
		int basePrice = readInt("Base price (MNT): ", 1, 10_000_000);

		CafeProduct product = category.createProduct(itemName, basePrice);
		MENU.computeIfAbsent(category, key -> new ArrayList<>()).add(product);
		MenuFileManager.append(category, product);
		System.out.println("Menu updated: " + itemName + " added to " + category.getLabel() + ".");
	}

	private static void openingHours() {
		System.out.println("\n+------------------------------+");
		System.out.println("|        OPENING HOURS         |");
		System.out.println("+------------------------------+");
		System.out.println("| Mon - Fri :  07:00 - 21:00  |");
		System.out.println("| Sat - Sun :  09:00 - 20:00  |");
		System.out.println("+------------------------------+");
	}

	private static void location() {
		System.out.println("\n+------------------------------------------+");
		System.out.println("|               LOCATION                   |");
		System.out.println("+------------------------------------------+");
		System.out.println("| 1. Branch: Sukhbaatar Square             |");
		System.out.println("| 2. Branch: Peace Avenue                  |");
		System.out.println("| 3. Branch: Bayangol District             |");
		System.out.println("+------------------------------------------+");
	}

	private static void feedback() {
		System.out.println("\n--- FEEDBACK ---");
		String customerName = readRequiredText("Your name: ");
		String text = readRequiredText("Please enter your feedback: ");
		MenuFileManager.appendFeedback(customerName, text);
		System.out.println("Your feedback has been received: " + text);
	}

	private static int readInt(String prompt, int min, int max) {
		while (true) {
			System.out.print(prompt);
			String value = SCANNER.nextLine().trim();
			try {
				int number = Integer.parseInt(value);
				if (number >= min && number <= max) {
					return number;
				}
			} catch (NumberFormatException ignored) {
				// Ask again below.
			}
			System.out.printf("Please enter a number between %d and %d.%n", min, max);
		}
	}

	private static String readSize() {
		while (true) {
			System.out.print("Size (S/M/L): ");
			String size = SCANNER.nextLine().trim().toUpperCase(Locale.ROOT);
			if (size.equals("S") || size.equals("M") || size.equals("L")) {
				return size;
			}
			System.out.println("Please enter S, M, or L.");
		}
	}

	private static boolean readYesNo(String prompt) {
		while (true) {
			System.out.print(prompt);
			String value = SCANNER.nextLine().trim().toLowerCase(Locale.ROOT);
			if (value.equals("y") || value.equals("yes") || value.equals("1")) {
				return true;
			}
			if (value.equals("n") || value.equals("no") || value.equals("0")) {
				return false;
			}
			System.out.println("Please enter y or n.");
		}
	}

	private static String readRequiredText(String prompt) {
		while (true) {
			System.out.print(prompt);
			String value = SCANNER.nextLine().trim();
			if (!value.isBlank()) {
				return value;
			}
			System.out.println("This field cannot be empty.");
		}
	}

	private static String formatMoney(int amount) {
		return String.format("%,d MNT", amount);
	}
}
