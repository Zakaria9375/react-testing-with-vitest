import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

export const simulateError = (endpoint: string) => {
	server.use(http.get(endpoint, () => HttpResponse.error()));
};
