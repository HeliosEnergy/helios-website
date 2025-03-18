import express, { Request, Response } from "express";

const PORT = 4777;
const app = express();

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World");
});


const api = express.Router();
{

	api.get("/", (req: Request, res: Response) => {
		res.send("Hello World");
	});


	const gpu_pricing = express.Router();
	{
		gpu_pricing.get("/", (req: Request, res: Response) => {
			res.send("Hello World");
		});
	}
	api.use("/gpu_pricing", gpu_pricing);


	const map_data = express.Router();
	{
		map_data.get("/", (req: Request, res: Response) => {
			res.send("Hello World");
		});
	}
	api.use("/map_data", map_data);

}
app.use("/api", api);


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
