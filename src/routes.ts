import express, { Request, Response } from 'express';
import fs from 'fs';

const routes = express.Router();

const readSubmissions = (): any[] => {
    try {
        const data = fs.readFileSync('db.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading submissions:', error);
        return [];
    }
};

const writeSubmissions = (submissions: any[]): void => {
    try {
        fs.writeFileSync('db.json', JSON.stringify(submissions, null, 2));
    } catch (error) {
        console.error('Error writing submissions:', error);
    }
};

routes.post('/submit', (req: Request, res: Response) => {
    try {
        const {  Name, Email, Phone, Github_Link, Stopwatch_Time } = req.body;
        console.log('Received submission:', req.body); 

        const submissions = readSubmissions();
        submissions.push({ Name, Email, Phone, Github_Link, Stopwatch_Time });
        writeSubmissions(submissions);

        res.status(201).send('Submission received');
    } catch (error) {
        console.error('Error handling submit request:', error);
        res.status(500).send('Error processing submission');
    }
});

routes.get('/read', (req: Request, res: Response) => {
    try {
        const index = parseInt(req.query.index as string, 10);
        const submissions = readSubmissions();

        if (index >= 0 && index < submissions.length) {
            res.json(submissions[index]);
        } else {
            res.status(404).send('Submission not found');
        }
    } catch (error) {
        console.error('Error handling read request:', error);
        res.status(500).send('Error fetching submission');
    }
});

routes.put('/edit/:index', (req: Request, res: Response) => {
    try {
        const index = parseInt(req.params.index, 10);
        const { Name, Email, Phone, Github_Link, Stopwatch_Time } = req.body;

        const submissions = readSubmissions();

        if (index >= 0 && index < submissions.length) {
            submissions[index] = { Name, Email, Phone, Github_Link, Stopwatch_Time };
            writeSubmissions(submissions);
            res.status(200).send('Submission updated successfully');
        } else {
            res.status(404).send('Submission not found');
        }
    } catch (error) {
        console.error('Error handling edit request:', error);
        res.status(500).send('Error editing submission');
    }
});


routes.delete('/delete/:index', (req: Request, res: Response) => {
    try {
        const index = parseInt(req.params.index, 10);

        const submissions = readSubmissions();

        if (index >= 0 && index < submissions.length) {
            submissions.splice(index, 1); 
            writeSubmissions(submissions);
            res.status(200).send('Submission deleted successfully');
        } else {
            res.status(404).send('Submission not found');
        }
    } catch (error) {
        console.error('Error handling delete request:', error);
        res.status(500).send('Error deleting submission');
    }
});

routes.get('/search', (req: Request, res: Response) => {
    try {
        const email = req.query.email as string;
        const submissions = readSubmissions();

        const results = submissions.filter(submission => submission.Email === email);

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No submissions found with the provided email');
        }
    } catch (error) {
        console.error('Error handling search request:', error);
        res.status(500).send('Error searching for submissions');
    }
});

export default routes;
