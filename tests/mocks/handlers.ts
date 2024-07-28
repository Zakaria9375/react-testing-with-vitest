import { db } from "./db";

// const allProducts: Product[] = [
// 	{ id: 1, name: "p1", price: 15 },
// 	{ id: 2, name: "p2", price: 13 },
// ];
export const handlers = [
	...db.product.toHandlers("rest"),
	...db.category.toHandlers("rest"),
];

// export const handlers = [
// 	http.get("/categories", () => {
// 		return HttpResponse.json([
// 			{ id: 1, name: "Electronics" },
// 			{ id: 2, name: "Beauty" },
// 			{ id: 3, name: "Gardening" },
// 		]);
// 	}),
// 	http.get("/products", () => {
// 		return HttpResponse.json(allProducts);
// 	}),
// 	http.get("products/:id", ({ params }) => {
// 		const { id } = params;
// 		const theId = Number(id);
// 		if (!theId) return new HttpResponse(null, { status: 404 });
// 		const product = allProducts.find(
// 			(product: Product) => product.id === theId
// 		);
// 		if (!product) return HttpResponse.json(null);
// 		return HttpResponse.json(product);
// 	}),
// ];
