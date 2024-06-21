import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';


const app = express();
const port = 3400;

app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
