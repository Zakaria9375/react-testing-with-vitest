import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";

describe("Label", () => {
	it("should render text in the given language", () => {
		render(<Label labelId="welcome" />);
	});
});
