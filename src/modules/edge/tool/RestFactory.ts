import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {Rest} from "./Rest";

export class RestFactory {
    create(edge: Edge, profile: Profile): Rest {
        return new Rest(edge, profile);
    }
}