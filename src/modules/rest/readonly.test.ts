import {beforeEach, describe, expect, test, vi} from "vitest";
import axios from "axios";
import {Rest} from "./Rest";
import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";

vi.mock("axios", () => ({default: vi.fn(async () => ({status: 200, data: {}}))}));

const edge: Edge = {
    name: "Test",
    tasks: [],
    api: {
        specification: {path: "unused.yaml"},
        request: {url: "https://api.example.test", headers: {}},
    },
};

const readonlyProfile: Profile = {readonly: true, edge: {tools: []}};
const writableProfile: Profile = {readonly: false, edge: {tools: []}};
const route = (method: string) => ({method, path: "/api/v2/findings/1/"});

describe("read-only profile", () => {
    beforeEach(() => {
        vi.mocked(axios).mockClear();
    });

    test.each(["DELETE", "POST", "PATCH", "PUT", "delete"])(
        "rejects %s before any request is sent",
        async (method) => {
            const rest = new Rest(edge, readonlyProfile);

            await expect(rest.callEndpoint(route(method))).rejects.toThrow("read-only");
            expect(axios).not.toHaveBeenCalled();
        },
    );

    test("still sends GET", async () => {
        const response = await new Rest(edge, readonlyProfile).callEndpoint(route("GET"));

        expect(response.status).toBe(200);
        expect(axios).toHaveBeenCalledTimes(1);
    });

    test("a writable profile still sends DELETE", async () => {
        await new Rest(edge, writableProfile).callEndpoint(route("DELETE"));

        expect(axios).toHaveBeenCalledTimes(1);
    });
});
