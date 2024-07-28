import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
	const renderComponent = () => {
		const onChange = vi.fn();
		render(
			<Theme>
				<OrderStatusSelector onChange={onChange} />
			</Theme>
		);
		screen.debug();
		return {
			btn: screen.getByRole("combobox"),
			user: userEvent.setup(),
			getOptions: () => screen.findAllByRole("option"),
			onChange,
		};
	};

	it("should render new as default value", () => {
		const { btn } = renderComponent();
		expect(btn).toHaveTextContent(/new/i);
	});

	it("should display options New, Processed, Fulfilled", async () => {
		const { btn, user, getOptions } = renderComponent();
		await user.click(btn);
		const opts = await getOptions();
		expect(opts).toHaveLength(3);
		const labels = opts.map((opt) => opt.textContent);
		expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
	});

	it.each([
		{ label: /processed/i, value: "processed" },
		{ label: /fulfilled/i, value: "fulfilled" },
	])(
		"should call change with $value when the $label is clicked",
		async ({ label, value }) => {
			const { btn, user, onChange } = renderComponent();
			await user.click(btn);
			const option = await screen.findByRole("option", { name: label });
			await user.click(option);
			expect(onChange).toHaveBeenCalledWith(value);
		}
	);
});
