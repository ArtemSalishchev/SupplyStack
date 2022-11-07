import express, {Router } from 'express';
import { CandidatesController } from '../controller/candidates';

class CandidatesRoutes {
    private router: Router;

    constructor() {
      this.router = express.Router();
    }

    public routes(): Router {
        this.router.post('/candidates', CandidatesController.prototype.postCandidate);
        this.router.get('/candidates', CandidatesController.prototype.getCandidate);
    
        return this.router;
      }
}

export const candidatesRoutes = new CandidatesRoutes();