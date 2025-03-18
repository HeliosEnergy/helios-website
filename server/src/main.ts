import express, { Request, Response } from "express";

const PORT = 4777;
const app = express();

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
