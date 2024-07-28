import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("Product Image Gallery", () => {
	const renderProductImageGallery = (imgUrls: string[]) =>
		render(<ProductImageGallery imageUrls={imgUrls} />);

	it("should render nothing if imgUrls is an empty array", () => {
		const noImgs: string[] = [];
		renderProductImageGallery(noImgs);
		const ul = screen.queryByRole("listbox");
		expect(ul).not.toBeInTheDocument();
	});

	it("should render list of imgs if imgUrls is passed and not empty", () => {
		const imgUrls: string[] = ["1", "2", "3"];
		renderProductImageGallery(imgUrls);
		const allImages = screen.queryAllByRole("img");
		expect(allImages.length).toBe(3);
		allImages.forEach((imgUrl, index) => {
			expect(imgUrl).toHaveAttribute("src", `${imgUrls[index]}`);
		});
	});
});
