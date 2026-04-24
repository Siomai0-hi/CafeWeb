package com.example.CafeWeb;

import com.example.CafeWeb.model.CafeOrder;
import com.example.CafeWeb.service.CafeService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CafeServiceTests {

	private final CafeService cafeService = new CafeService();

	@Test
	void createsOrderFromMenuQuantities() {
		CafeOrder order = cafeService.placeOrder("Davaa", "A3", "less sugar", Map.of(
				"qty_latte", "2",
				"qty_croissant", "1"));

		assertThat(order.lines()).hasSize(2);
		assertThat(order.total()).isEqualByComparingTo(new BigDecimal("26500"));
		assertThat(order.customerName()).isEqualTo("Davaa");
		assertThat(order.tableNumber()).isEqualTo("A3");
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
}
