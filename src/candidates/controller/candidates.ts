import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Candidate, CandidateFromRequest } from '../model/candidate';

const inMemoryStorage: Map<number, Candidate> = new Map();

export class CandidatesController {

    private addCandidateToStorage(candidate: Candidate):  Map<number, Candidate> {
        inMemoryStorage.set(candidate.id, candidate);
        return inMemoryStorage;
    }

    private convertCandidateToModel(candidate: CandidateFromRequest): Candidate {
        return {
            ...candidate,
            skills: new Set(candidate.skills),
        }
    }


    private convertCandidateToResponse(candidate: Candidate): CandidateFromRequest {
        return {
            ...candidate,
            skills: Array.from(candidate.skills),
        }
    }

    private getSkillsMatches(query: string[], candidate: Candidate) {
        let matches = 0;
        for( let skill of query){
            if(candidate.skills.has(skill)){
                matches +=1
            }
        }
        return matches;
    }

    private getBestCandidate(query: string[]) {
        if(inMemoryStorage.size === 0){
            throw new Error('There is not any candidate')
        }
        const matches = new Map<number, number>();
        for(let candidate of inMemoryStorage){
            matches.set(
                CandidatesController.prototype.getSkillsMatches(query, candidate[1]),
                candidate[0]
            )
        }
        const bestMatches = Math.max(...Array.from(matches.keys()));
        if(bestMatches === 0){
            throw new Error('No one candidate matches required skills')
        }
        const bestCandidateId = matches.get(bestMatches);
        const bestCandidate = inMemoryStorage.get(bestCandidateId!);
        return CandidatesController.prototype.convertCandidateToResponse(bestCandidate!)
    } 

    public postCandidate(req: Request, res: Response, _: NextFunction) {
        try {
            const candidate  = req.body; // suppose body is {id, name, skills}
            if (!candidate || !candidate.skills) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'No Candidate Data Provided' });
                return;
            }
            const convertedCandidate = CandidatesController.prototype.convertCandidateToModel(candidate);
            CandidatesController.prototype.addCandidateToStorage(convertedCandidate);
            res.status(HTTP_STATUS.CREATED).send({ message: 'Candidate was added'});
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err.message);
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Unknown Error' });
            }
        }
    }

    public getCandidate(req: Request, res: Response) {
        try{
            if(!req.query || !req.query.skills){
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'No Search Query Provided' });
                return;
            }
            const query: string[]  = (req.query.skills as string).split(',');
            const bestCandidate = CandidatesController.prototype.getBestCandidate(query);
            res.status(HTTP_STATUS.OK).send(bestCandidate)
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err.message);
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Unknown Error' });
            }
        }  
    }
}
