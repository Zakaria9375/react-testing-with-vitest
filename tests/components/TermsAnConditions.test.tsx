import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("Terms & Conditions", () => {
	const renderTermsAndConditions = () => {
		render(<TermsAndConditions />);
		return {
			heading: screen.getByRole("heading"),
			cb: screen.getByRole("checkbox"),
			btn: screen.getByRole("button"),
		};
	};
	it("should render correctly", () => {
		const { heading, cb, btn } = renderTermsAndConditions();
		//Render correctly
		expect(heading).toBeInTheDocument();
		//Render with unchecked checkbox(initial state)
		expect(cb).toBeInTheDocument();
		expect(cb).not.toBeChecked();
		//Render with disabled submit button(initial state)
		expect(btn).toBeInTheDocument();
		expect(btn).toBeDisabled();
	});

	it("should enable submit btn once the checkbox is checked", async () => {
		const { cb, btn } = renderTermsAndConditions();
		const user = userEvent.setup();
		await user.click(cb);
		expect(btn).toBeEnabled();
	});
});
