import { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "HEAD", "POST"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Handler function invoked.");
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    try {
      const { amount } = req.body;
      const key_id = process.env.RAZORPAYIDKEY as string;
      const key_secret = process.env.RAZORPAYSECRETKEY as string;

      if (!key_id || !key_secret) {
        throw new Error("Razorpay key_id or key_secret is not defined");
      }

      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: "Error creating order" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
