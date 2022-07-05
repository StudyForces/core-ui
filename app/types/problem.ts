export default interface Problem {
    id: number;
    problem: string;
    solution?: string;
    published: boolean;
    attachments: any[];
}
