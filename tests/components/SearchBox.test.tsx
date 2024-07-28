import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("Search Box", () => {
	const renderSearchBox = () => {
		const onChange = vi.fn();
		render(<SearchBox onChange={onChange} />);
		return {
			searchInput: screen.getByPlaceholderText(/search/i),
			onChange,
			user: userEvent.setup(),
		};
	};
	it("should render correctly", () => {
		const { searchInput } = renderSearchBox();
		expect(searchInput).toBeInTheDocument();
	});

	it("should call onChange if enter is pressed and searchTerm not empty", async () => {
		const searchTerm = "anything";
		const { searchInput, onChange, user } = renderSearchBox();
		await user.type(searchInput, searchTerm + "{enter}");
		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange).toHaveBeenCalledWith(searchTerm);
	});

	it("should not call onChange if enter is pressed and searchTerm is empty", async () => {
		const searchTerm = "";
		const { searchInput, onChange, user } = renderSearchBox();
		await user.type(searchInput, searchTerm + "{enter}");
		expect(onChange).not.toHaveBeenCalledOnce();
	});
});
