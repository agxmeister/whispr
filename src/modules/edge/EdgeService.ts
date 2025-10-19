import { injectable, inject } from "inversify";
import { Edge } from "./types";
import { EdgeRepository } from "./EdgeRepository";
import { dependencies } from "@/dependencies";

@injectable()
export class EdgeService {
    constructor(@inject(dependencies.EdgeRepository) private readonly repository: EdgeRepository) {}

    async getAll(): Promise<Edge[]> {
        return this.repository.getAll();
    }
}
