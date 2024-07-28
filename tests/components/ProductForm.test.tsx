import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
describe("ProductForm", () => {
	const renderComponent = (product?: Product) => {
		const onSubmit = vi.fn();
		render(<ProductForm onSubmit={onSubmit} product={product} />, {
			wrapper: AllProviders,
		});

		return {
			waitFormToLoad: async () => {
				await screen.findByRole("form");
				const name = screen.getByPlaceholderText(/name/i);
				const price = screen.getByPlaceholderText(/price/i);
				const select = screen.getByRole("combobox", { name: /category/i });
				const submit = screen.getByRole("button", { name: /submit/i });
				const user = userEvent.setup();
				type FormData = {
					name: any;
					price: any;
					categoryId: any;
				};
				const testData = {
					name: "john",
					price: 6,
					categoryId: category.id,
				};
				async function fill(data: FormData) {
					if (data.name !== undefined) await user.type(name, data.name);
					if (data.price !== undefined)
						await user.type(price, data.price.toString());
					if (data.categoryId !== undefined) {
						await user.tab();
						await user.click(select);
						const opts = screen.getAllByRole("option");
						await user.click(opts[0]);
					}
					await user.click(submit);
				}
				return {
					name,
					price,
					select,
					submit,
					user,
					fill,
					testData,
				};
			},
			expectErr: (errMsg: any) => {
				const err = screen.getByRole("alert");
				expect(err).toBeInTheDocument();
				expect(err).toHaveTextContent(errMsg);
			},
			onSubmit,
		};
	};

	let category: Category;
	beforeAll(() => {
		category = db.category.create();
	});

	it("should render correctly", async () => {
		const { waitFormToLoad } = renderComponent();
		const { name, price, select } = await waitFormToLoad();
		expect(name).toBeInTheDocument();
		expect(price).toBeInTheDocument();
		expect(select).toBeInTheDocument();
	});

	it("should render correctly with product values if passed", async () => {
		const product: Product = {
			id: 1,
			name: "bread",
			price: 110,
			categoryId: category.id,
		};
		const { waitFormToLoad } = renderComponent(product);
		const { name, price, select } = await waitFormToLoad();
		expect(name).toHaveValue(product.name);
		expect(price).toHaveValue(product.price.toString());
		expect(select).toHaveTextContent(category.name);
	});

	it("should set focus on name input", async () => {
		const { waitFormToLoad } = renderComponent();
		const form = await waitFormToLoad();
		expect(form.name).toHaveFocus();
	});

	it.each([
		{ scenario: "missing", errMsg: /required/i },
		{
			scenario: "too long",
			name: "a".repeat(258),
			errMsg: /255 character/i,
		},
	])(
		"should display a name error when it is $scenario",
		async ({ name, errMsg }) => {
			const { waitFormToLoad, expectErr } = renderComponent();
			const form = await waitFormToLoad();
			await form.fill({ ...form.testData, name });
			//assert
			expectErr(errMsg);
		}
	);

	it.each([
		{ scenario: "missing", errMsg: /required/i },
		{
			scenario: "negative",
			price: -1,
			errMsg: /greater than or equal to 1/i,
		},
		{
			scenario: "greater than 1000",
			price: 1001,
			errMsg: /less than or equal to 1000/i,
		},
		{
			scenario: "must be numeric",
			price: "a",
			errMsg: /required/i,
		},
	])(
		"should display a price error when it is $scenario",
		async ({ price, errMsg }) => {
			const { waitFormToLoad, expectErr } = renderComponent();
			//user entering data
			const form = await waitFormToLoad();
			await form.fill({ ...form.testData, price });
			//assert
			expectErr(errMsg);
		}
	);

	it("should display a category error when it is empty ", async () => {
		const { waitFormToLoad, expectErr } = renderComponent();
		//user entering data
		const form = await waitFormToLoad();
		await form.fill({ price: 5, name: "John", categoryId: undefined });
		//assert
		expectErr(/required/i);
	});

	it("should call onSubmit when it is submitted", async () => {
		const { waitFormToLoad, onSubmit } = renderComponent();
		//user entering data
		const form = await waitFormToLoad();
		await form.fill({ ...form.testData });
		//assert
		expect(onSubmit).toHaveBeenCalledWith(form.testData);
	});

	afterAll(() => {
		db.category.delete({ where: { id: { equals: category.id } } });
	});
});
