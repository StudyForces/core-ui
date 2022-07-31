import type ProblemType from "~/types/problem-type";
import type Tag from "~/types/Tag";
import type ProblemSolve from "./solve/problem-solve";

export default interface Problem {
    id: number;
    type: ProblemType;
    problem: string;
    solution?: string;
    published: boolean;
    attachments: any[];
    sourcesId: number;
    createdBy?: string;
    createdDate: number;
    modifiedBy?: string;
    modifiedDate: number;
    tags?: Tag[];
    solverMetadata?: ProblemSolve;
}
