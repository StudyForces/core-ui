import type ProblemType from "~/types/problem-type";
import Tag from "~/types/Tag";
import ProblemSolve from "./solve/problem-solve";

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
