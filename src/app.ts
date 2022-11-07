import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { candidatesRoutes } from './candidates/routes/candidatesRoutes';

const PORT = 5000;
const API_PATH = '/api/v1'

class Application {
    public run(){
        const app: Express = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(API_PATH, candidatesRoutes.routes());
        app.listen(PORT, () => console.log(`Express started on port: ${PORT}`));
    }
}

const application = new Application();
application.run();
