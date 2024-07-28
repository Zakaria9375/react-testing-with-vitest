import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";
import { db } from "../mocks/db";

describe("Router", () => {
	function navigateTo(url: string) {
		const router = createMemoryRouter(routes, {
			initialEntries: [url],
		});
		render(<RouterProvider router={router} />);
	}
	it("should render home page as root route", () => {
		navigateTo("/");
		const el = screen.getByRole("heading", { name: /home/i });
		expect(el).toBeInTheDocument();
	});
	it("should render products page while navigate to /products", () => {
		navigateTo("/products");
		const el = screen.getByRole("heading", { name: /products/i });
		expect(el).toBeInTheDocument();
	});
	it("should render productDetails page while navigate to /products/:id", async () => {
		const product = db.product.create();
		navigateTo(`/products/${product.id}`);
		const el = await screen.findByRole("heading", { name: product.name });
		expect(el).toBeInTheDocument();
		db.product.delete({ where: { id: { equals: product.id } } });
	});
	it("should render not found page while navigate to not-existing route", () => {
		navigateTo("/not-found");
		const el = screen.getByText(/not found/);
		expect(el).toBeInTheDocument();
	});
});
