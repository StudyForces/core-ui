import type ProblemType from "~/types/problem-type";

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
}
