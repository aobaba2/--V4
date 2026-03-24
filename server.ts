import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory order storage (for demo purposes)
  const orders: any[] = [];

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/orders", (req, res) => {
    const { tableNumber, items, totalAmount } = req.body;
    
    if (!tableNumber || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const newOrder = {
      id: Date.now().toString(),
      tableNumber,
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    console.log("New Order Received:", newOrder);
    
    res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id });
  });

  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
