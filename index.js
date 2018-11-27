const server = express();
server.use(express.json());


const port = 8000;
server.listen(port, () => console.log(`server is running on ${port}`))