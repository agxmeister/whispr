import {beforeEach, describe, expect, test, vi} from "vitest";
import axios from "axios";
import {Rest} from "./Rest";
import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";

vi.mock("axios", () => ({default: vi.fn(async () => ({status: 200, data: {}}))}));

const makeEdge = (rejectUnauthorized?: boolean): Edge => ({
    name: "Test",
    tasks: [],
    api: {
        specification: {path: "unused.yaml"},
        request: {url: "https://api.example.test", headers: {}, rejectUnauthorized},
    },
});

const profile: Profile = {readonly: false, edge: {tools: []}};
const agentOptions = () => (vi.mocked(axios).mock.calls[0][0] as any).httpsAgent.options;

describe("TLS certificate verification", () => {
    beforeEach(() => {
        vi.mocked(axios).mockClear();
    });

    test("is off by default", async () => {
        await new Rest(makeEdge(), profile).callEndpoint({method: "GET", path: "/ping"});

        expect(agentOptions().rejectUnauthorized).toBe(false);
    });

    test("is on for an edge that sets rejectUnauthorized", async () => {
        await new Rest(makeEdge(true), profile).callEndpoint({method: "GET", path: "/ping"});

        expect(agentOptions().rejectUnauthorized).toBe(true);
    });
});
