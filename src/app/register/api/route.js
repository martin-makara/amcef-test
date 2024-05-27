// pages/api/user.js
import { MongoClient } from "mongodb";

export async function POST(req, res) {
	// console.log(req);
	if (req.method === "POST") {
		const dbName = "sample_mflix";
		const client = new MongoClient(
			`mongodb+srv://pukiyolo:oIO8NsyWW9o2gyTf@amcef-test.77sl8m0.mongodb.net/?retryWrites=true&w=majority&appName=amcef-test`
		);

		try {
			console.log("req.body", req.body);
			await client.connect();
			const database = client.db(dbName);
			const collection = database.collection("users");

			const result = await collection.insertOne(req.body);

			// res.status(200).json({ success: true, data: result.ops[0] });
		} catch (error) {
			// res.status(500).json({ success: false, message: error.toString() });
		} finally {
			await client.close();
		}
	} else {
		res.status(405).json({ success: false, message: "Method not allowed" });
	}
}
