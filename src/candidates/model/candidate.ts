export interface Candidate {
    id: number; 
    name: string;
    skills: Set<string>; 
}

export interface CandidateFromRequest {
    id: number; 
    name: string;
    skills: Array<string>; 
}
