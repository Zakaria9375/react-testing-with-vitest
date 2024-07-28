import { render, screen } from "@testing-library/react";
import { User } from "../../src/entities";
import UserAccount from "../../src/components/UserAccount";

describe("User Account", () => {
	const admin: User = {
		id: 4,
		name: "Ziko",
		isAdmin: true,
	};
	const user: User = {
		id: 5,
		name: "Ziko",
		isAdmin: false,
	};

	const renderUserAccount = (user: User) => render(<UserAccount user={user} />);

	it("should render user.name in the component", () => {
		renderUserAccount(admin);
		expect(screen.queryByText(/Ziko/i)).toBeInTheDocument();
	});

	it("should render edit btn while isAdmin is true", () => {
		renderUserAccount(admin);
		const btn = screen.getByRole("button", { name: /edit/i });
		expect(btn).toBeInTheDocument();
	});

	it("should not render edit btn while isAdmin is false", () => {
		renderUserAccount(user);
		const btn = screen.queryByRole("button", { name: /edit/i });
		expect(btn).not.toBeInTheDocument();
	});
});
