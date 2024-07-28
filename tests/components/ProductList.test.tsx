import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse, delay } from "msw";
import { db } from "../mocks/db";
import AllProviders from "../AllProviders";

describe("ProductList", () => {
	const renderComponent = () => {
		render(<ProductList />, { wrapper: AllProviders });
	};
	const ids: number[] = [];
	beforeAll(() => {
		[1, 2, 3].forEach(() => {
			const product = db.product.create();
			ids.push(product.id);
		});
	});

	it("should render list of products", async () => {
		renderComponent();
		const items = await screen.findAllByRole("listitem");
		expect(items.length).toBeGreaterThan(0);
	});

	it("should render no products available if no products are found", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.json([]);
			})
		);
		renderComponent();
		const msg = await screen.findByText(/no products/i);
		expect(msg).toBeInTheDocument();
	});

	it("should render an error when error occurred", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.error();
			})
		);
		renderComponent();
		const msg = await screen.findByText(/error/i);
		expect(msg).toBeInTheDocument();
	});

	it("should render a loading indicator until data is fetched", async () => {
		server.use(
			http.get("/products", async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);
		renderComponent();
		const loading = await screen.findByText(/loading/i);
		expect(loading).toBeInTheDocument();
	});

	it("should remove loading indicator once data is fetched", async () => {
		renderComponent();
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});

	afterAll(() => {
		db.product.deleteMany({ where: { id: { in: ids } } });
	});
});
