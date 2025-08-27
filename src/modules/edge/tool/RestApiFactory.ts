import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {RestApi} from "./RestApi";

export class RestApiFactory {
    create(edge: Edge, profile: Profile): RestApi {
        return new RestApi(edge, profile);
    }
}