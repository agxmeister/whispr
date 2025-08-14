import { Edge } from "./types";
import { EdgeRepository } from "./repository";

class EdgeService {
    constructor(private readonly repository: EdgeRepository) {}

    async getEdges(): Promise<Edge[]> {
        return this.repository.getAll();
    }
}

export { EdgeService };