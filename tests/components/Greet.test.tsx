import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";
describe("Greet Component", () => {
	const renderGreat = (name: string) => render(<Greet name={name} />);

	it("should render the name when it passed as a prop", () => {
		renderGreat("Ziko");
		const h = screen.getByRole("heading");
		expect(h).toBeInTheDocument();
		expect(h).toHaveTextContent(/hello ziko/i);
	});

	it("should not render the name when it is not passed as a prop", () => {
		renderGreat("");
		const headers = screen.queryByRole("heading");
		expect(headers).toBeFalsy();
	});
});
