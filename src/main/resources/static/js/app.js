const currency = new Intl.NumberFormat("en-US");
const form = document.querySelector("#orderForm");
const totalTarget = document.querySelector("#orderTotal");

function quantityInput(button) {
	return button.parentElement.querySelector("input");
}

function clampQuantity(value) {
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed)) {
		return 0;
	}
	return Math.max(0, Math.min(12, parsed));
}

function updateTotal() {
	if (!form || !totalTarget) {
		return;
	}

	let total = 0;
	form.querySelectorAll(".menu-card").forEach((card) => {
		const price = Number.parseFloat(card.dataset.price || "0");
		const input = card.querySelector("input[type='number']");
		total += price * clampQuantity(input.value);
	});

	totalTarget.textContent = `${currency.format(total)} MNT`;
}

document.querySelectorAll(".step-button").forEach((button) => {
	button.addEventListener("click", () => {
		const input = quantityInput(button);
		const step = Number.parseInt(button.dataset.step, 10);
		input.value = clampQuantity(input.value) + step;
		input.value = clampQuantity(input.value);
		updateTotal();
	});
});

document.querySelectorAll(".stepper input").forEach((input) => {
	input.addEventListener("input", () => {
		input.value = clampQuantity(input.value);
		updateTotal();
	});
});

updateTotal();
