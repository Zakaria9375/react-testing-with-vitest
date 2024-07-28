import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import AllProviders from "../AllProviders";

describe("ProductDetails", () => {
	const renderComponent = (id: number) =>
		render(<ProductDetail productId={id} />, { wrapper: AllProviders });

	let productId: number;
	beforeAll(() => {
		const product = db.product.create();
		productId = product.id;
	});

	it("should render product price if product is found", async () => {
		renderComponent(productId);
		const product = db.product.findFirst({
			where: { id: { equals: productId } },
		});
		const productPrice = await screen.findByText(
			new RegExp(product!.price.toString())
		);
		expect(productPrice).toBeInTheDocument();
	});

	it("should render message if product is not found", async () => {
		server.use(
			http.get("/products/:id", () => {
				return HttpResponse.json(null);
			})
		);
		renderComponent(5);

		const msg = await screen.findByText(/product was not found/i);
		expect(msg).toBeInTheDocument();
	});

	it("should render error message if id is not defined", async () => {
		server.use(
			http.get("/products/:id", () => {
				return HttpResponse.error();
			})
		);
		renderComponent(0);
		const msg = await screen.findByText(/Error:/i);
		expect(msg).toBeInTheDocument();
	});

	afterAll(() => {
		db.product.delete({ where: { id: { equals: productId } } });
	});
});
