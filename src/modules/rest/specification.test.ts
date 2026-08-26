import {describe, expect, test} from "vitest";
import {getOpenApiEndpoints} from "./utils";

describe("pinned DefectDojo specification", () => {
    test("loads from resources/specifications and exposes the endpoints the edge relies on", async () => {
        const endpoints = await getOpenApiEndpoints({path: "defectdojo-2.54.1.yaml"});
        const routes = endpoints.map((endpoint) => `${endpoint.route.method} ${endpoint.route.path}`);

        expect(routes).toContain("get /api/v2/findings/");
        expect(routes).toContain("patch /api/v2/findings/{id}/");
        expect(routes).toContain("post /api/v2/reimport-scan/");
    });

    test("readonly listing keeps only GET routes", async () => {
        const endpoints = await getOpenApiEndpoints({path: "defectdojo-2.54.1.yaml"}, true);

        expect(endpoints.length).toBeGreaterThan(0);
        expect(endpoints.every((endpoint) => endpoint.route.method === "get")).toBe(true);
    });
});
