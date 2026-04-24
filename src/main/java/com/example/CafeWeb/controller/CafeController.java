package com.example.CafeWeb.controller;

import com.example.CafeWeb.model.CafeOrder;
import com.example.CafeWeb.model.MenuItem;
import com.example.CafeWeb.service.CafeService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;

@Controller
public class CafeController {

	private final CafeService cafeService;

	public CafeController(CafeService cafeService) {
		this.cafeService = cafeService;
	}

	@GetMapping("/")
	public String home(Model model) {
		model.addAttribute("menuByCategory", cafeService.getMenuByCategory());
		model.addAttribute("menuCount", cafeService.getMenu().size());
		if (!model.containsAttribute("form")) {
			model.addAttribute("form", Map.of());
		}
		return "index";
	}

	@PostMapping("/orders")
	public String placeOrder(@RequestParam Map<String, String> form, Model model, RedirectAttributes redirectAttributes) {
		try {
			CafeOrder order = cafeService.placeOrder(
					form.get("customerName"),
					form.get("tableNumber"),
					form.get("note"),
					form);

			model.addAttribute("order", order);
			return "order";
		} catch (IllegalArgumentException ex) {
			redirectAttributes.addFlashAttribute("error", ex.getMessage());
			redirectAttributes.addFlashAttribute("form", form);
			return "redirect:/";
		}
	}

	@GetMapping("/api/menu")
	@ResponseBody
	public List<MenuItem> menuApi() {
		return cafeService.getMenu();
	}
}
