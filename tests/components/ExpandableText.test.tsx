import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("Expandable Text", () => {
	const longText =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi asperiores ut placeat eum accusantium quos aliquid neque fugit. Molestias ut error labore eum impedit, sit quaerat. Minima, voluptatibus voluptatum? Hic aperiam delectus dolore suscipit iusto dolorem quisquam fugit maxime optio modi possimus officia tempora culpa autem ea cum, repellendus similique dolores?";

	const renderExpandableTest = (text: string) => {
		render(<ExpandableText text={text} />);
		return {
			btn: screen.getByRole("button"),
			text: screen.getByRole("article"),
		};
	};
	it("should render only text if text length is less than the limit", () => {
		const shortText = "This is short";
		render(<ExpandableText text={shortText} />);
		const btn = screen.queryByRole("button");
		expect(btn).not.toBeInTheDocument();
	});

	it("should render text with btn if text length is more than the limit", () => {
		const { btn } = renderExpandableTest(longText);
		expect(btn).toBeInTheDocument();
	});

	it("should change the btn from SHow More to Show less once btn is clicked", async () => {
		const { btn } = renderExpandableTest(longText);
		expect(btn).toHaveTextContent(/Show More/i);
		const user = userEvent.setup();
		await user.click(btn);
		expect(btn).toHaveTextContent(/Show Less/i);
	});

	it("should change the displayed text from truncated format to complete text once btn is clicked", async () => {
		const { btn, text } = renderExpandableTest(longText);
		expect(text.textContent?.length).toBe(258);
		const user = userEvent.setup();
		await user.click(btn);
		expect(text.textContent?.length).toEqual(longText.length);
	});
});
