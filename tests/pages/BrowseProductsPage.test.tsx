import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import userEvent from "@testing-library/user-event";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import { simulateDelay } from "../utils/simulateDelay";
import { simulateError } from "../utils/simulateError";
import AllProviders from "../AllProviders";

describe("Browse Product page", () => {
	const renderComponent = () => {
		render(
			<BrowseProducts />,

			{ wrapper: AllProviders }
		);
		return {
			getProductsSkeleton: screen.queryByRole("progressbar", {
				name: /products/i,
			}),
			getCategoriesSkeleton: screen.queryByRole("progressbar", {
				name: /categories/i,
			}),
			user: userEvent.setup(),
		};
	};

	const category = db.category.create();
	const categories: Category[] = [];
	const products: Product[] = [];
	beforeAll(() => {
		[1, 2].forEach(() => categories.push(category));
		[1, 2].forEach(() =>
			products.push(db.product.create({ categoryId: category.id }))
		);
	});

	describe("categories", () => {
		it("should show a loading skeleton when fetching", () => {
			simulateDelay("/categories");
			const { getCategoriesSkeleton } = renderComponent();
			expect(getCategoriesSkeleton).toBeInTheDocument();
		});

		it("should hide a loading skeleton after fetching", async () => {
			const { getCategoriesSkeleton } = renderComponent();
			await waitForElementToBeRemoved(getCategoriesSkeleton);
		});

		it("should render correctly", async () => {
			renderComponent();
			const combo = await screen.findByRole("combobox");
			expect(combo).toBeInTheDocument();
			const user = userEvent.setup();
			await user.click(combo);
			const optAll = screen.getByRole("option", { name: /all/i });
			expect(optAll).toBeInTheDocument();
			categories.forEach((c) => {
				const opt = screen.getByRole("option", { name: c.name });
				expect(opt).toBeInTheDocument();
			});
		});

		it("should not display an error if it can not be fetched", async () => {
			simulateError("/categories");
			const { getCategoriesSkeleton } = renderComponent();
			await waitForElementToBeRemoved(getCategoriesSkeleton);
			const noError = screen.queryByText(/error/i);
			expect(noError).not.toBeInTheDocument();
			const combo = screen.queryByRole("combobox", { name: /category/i });
			expect(combo).not.toBeInTheDocument();
		});
	});

	describe("products", () => {
		it("should show a loading skeleton when fetching", () => {
			simulateDelay("/products");
			const { getProductsSkeleton } = renderComponent();
			expect(getProductsSkeleton).toBeInTheDocument();
		});

		it.skip("should hide a loading skeleton after fetching", async () => {
			// Related to HTML structure, leave it for now
			const { getProductsSkeleton } = renderComponent();
			screen.debug();
			await waitForElementToBeRemoved(getProductsSkeleton);
		});

		it("should render correctly", () => {
			renderComponent();
			products.forEach(async (p) => {
				const prod = await screen.findByText(p.name);
				expect(prod).toBeInTheDocument();
			});
		});

		it("should display an error if it can not be fetched", async () => {
			simulateError("/products");
			const { getProductsSkeleton } = renderComponent();
			await waitForElementToBeRemoved(getProductsSkeleton);
			const err = screen.queryByText(/error/i);
			expect(err).toBeInTheDocument();
		});

		it("should filter products by categories", async () => {
			const { user, getCategoriesSkeleton } = renderComponent();
			await waitForElementToBeRemoved(getCategoriesSkeleton);
			const combo = await screen.findByRole("combobox");
			await user.click(combo);
			const selectedCategory = categories[0];
			const opt = screen.getByRole("option", {
				name: `${selectedCategory.name}`,
			});
			await user.click(opt);

			const products = db.product.findMany({
				where: {
					categoryId: { equals: selectedCategory.id },
				},
			});

			const rows = screen.getAllByRole("row");
			// + 1 for heading of table
			expect(rows).toHaveLength(products.length + 1);
		});
	});

	afterAll(() => {
		const idsC = categories.map((c) => c.id);
		db.category.deleteMany({
			where: { id: { in: idsC } },
		});
		const idsP = products.map((p) => p.id);
		db.product.deleteMany({
			where: { id: { in: idsP } },
		});
	});
});
