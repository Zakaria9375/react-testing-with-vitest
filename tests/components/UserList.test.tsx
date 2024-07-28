import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("User List", () => {
	const renderUserList = (users: User[]) => render(<UserList users={users} />);
	const users: User[] = [
		{ id: 1, isAdmin: true, name: "Ali" },
		{ id: 2, isAdmin: true, name: "Ali2" },
	];

	it("should render 'No users available.' when passing users as []", () => {
		const noUsers: User[] = [];
		renderUserList(noUsers);
		//Render the paragraph properly
		const p = screen.queryByRole("paragraph");
		expect(p).toBeInTheDocument();
		expect(p).toHaveTextContent(/No users available./i);
		//Does not render any item in the list
		const u = screen.queryByRole("listitem");
		expect(u).not.toBeInTheDocument();
	});

	it("should render users when passing users to the components", () => {
		renderUserList(users);
		//Does not render the paragraph
		const p = screen.queryByRole("paragraph");
		expect(p).not.toBeInTheDocument();
		//Render items in the list
		const u = screen.queryAllByRole("listitem");
		expect(u.length).toBe(2);
	});

	it("should render users with the correct href", () => {
		renderUserList(users);
		users.forEach((u) => {
			const link = screen.getByRole("link", { name: u.name });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", `/users/${u.id}`);
		});
	});
});
