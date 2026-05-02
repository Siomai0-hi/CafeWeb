package com.example.CafeWeb;

import com.example.CafeWeb.model.CafeOrder;
import com.example.CafeWeb.service.CafeService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CafeServiceTests {

	private final CafeService cafeService = new CafeService();

	@Test
	void createsOrderFromMenuQuantities() {
		CafeOrder order = cafeService.placeOrder("Davaa", "A3", "less sugar", Map.of(
				"qty_latte", "2",
				"qty_croissant", "1",
				"paymentMethod", "QPay"));

		assertThat(order.lines()).hasSize(2);
		assertThat(order.subtotal()).isEqualByComparingTo(new BigDecimal("26500"));
		assertThat(order.total()).isEqualByComparingTo(new BigDecimal("26500"));
		assertThat(order.customerName()).isEqualTo("Davaa");
		assertThat(order.tableNumber()).isEqualTo("A3");
		assertThat(order.paymentMethod()).isEqualTo("QPay");
	}

	@Test
	void requiresCustomerNameAndAtLeastOneItem() {
		assertThatThrownBy(() -> cafeService.placeOrder("", "A3", "", Map.of("qty_latte", "1")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Нэрээ");

		assertThatThrownBy(() -> cafeService.placeOrder("Davaa", "A3", "", Map.of()))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("бүтээгдэхүүн");
	}

	@Test
	void appliesOrderDiscountForLargeOrders() {
		CafeOrder order = cafeService.placeOrder("Davaa", "A3", "", Map.of(
				"qty_sandwich", "3",
				"qty_latte", "1"));

		assertThat(order.subtotal()).isEqualByComparingTo(new BigDecimal("59000"));
		assertThat(order.discountLabel()).isEqualTo("Order over 50,000");
		assertThat(order.discountAmount()).isEqualByComparingTo(new BigDecimal("5900"));
		assertThat(order.total()).isEqualByComparingTo(new BigDecimal("53100"));
	}

	@Test
	void calculatesCalendarDiscounts() {
		assertThat(cafeService.calculateDiscount(new BigDecimal("10000"), LocalDate.of(2026, 2, 14)).amount())
				.isEqualByComparingTo(new BigDecimal("3000"));

		assertThat(cafeService.calculateDiscount(new BigDecimal("10000"), LocalDate.of(2024, 11, 29)).amount())
				.isEqualByComparingTo(new BigDecimal("2000"));
	}
}
