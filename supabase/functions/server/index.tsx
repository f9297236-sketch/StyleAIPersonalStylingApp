import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ee37a11a/health", (c) => {
  return c.json({ status: "ok" });
});

// Generate Outfit (Mock Backend Logic)
app.post("/make-server-ee37a11a/generate", async (c) => {
  try {
    const body = await c.req.json();
    const { photo, style, customStyle } = body;

    // In a real app, we'd send 'photo' to Stable Diffusion/Runway API
    // and use GPT-4 Vision to analyze body shape and parse the customStyle.
    
    const id = crypto.randomUUID();
    
    const transformedPhoto = "https://images.unsplash.com/photo-1616847220575-31b062a4cd05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZHklMjBzdHJlZXR3ZWFyJTIwd29tYW4lMjBmdWxsJTIwYm9keSUyMG91dGZpdHxlbnwxfHx8fDE3ODA5MzI0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
    
    const items = [
      {
        id: 1,
        name: "Oversized Vintage Wash Hoodie",
        category: "Top",
        brand: "Urban Outfitters",
        price: "$65.00",
        distance: "1.2 mi",
        inStock: true,
        color: "Charcoal",
      },
      {
        id: 2,
        name: "Wide Leg Cargo Pants",
        category: "Bottom",
        brand: "Zara",
        price: "$49.90",
        distance: "0.8 mi",
        inStock: true,
        color: "Olive Green",
      },
      {
        id: 3,
        name: "Chunky Sole Sneakers",
        category: "Shoes",
        brand: "Local Boutique 'Kicks'",
        price: "$120.00",
        distance: "2.5 mi",
        inStock: false,
        color: "White/Grey",
      },
      {
        id: 4,
        name: "Layered Chain Necklace",
        category: "Accessories",
        brand: "H&M",
        price: "$14.99",
        distance: "0.8 mi",
        inStock: true,
        color: "Silver",
      }
    ];

    const result = {
      id,
      originalPhoto: photo,
      transformedPhoto,
      style: style || customStyle,
      items,
      createdAt: new Date().toISOString()
    };

    // Save to KV store — best-effort, don't fail the request if DB is down
    kv.set(`outfit_${id}`, result).catch((saveErr) => {
      console.error("Failed to persist outfit:", saveErr);
    });

    return c.json({ success: true, result });
  } catch (error) {
    console.error("Generation error:", error);
    return c.json({ success: false, error: "Failed to generate outfit" }, 500);
  }
});

// Get History
app.get("/make-server-ee37a11a/history", async (c) => {
  try {
    const records = await kv.getByPrefix("outfit_");
    return c.json({ success: true, history: records });
  } catch (error) {
    console.error("History error:", error);
    // Return empty history instead of an error so the UI stays functional
    return c.json({ success: true, history: [] });
  }
});

// Save/Like an outfit
app.post("/make-server-ee37a11a/save", async (c) => {
  try {
    const { id, saved } = await c.req.json();
    const outfit = await kv.get(`outfit_${id}`);
    if (outfit) {
      outfit.saved = saved;
      await kv.set(`outfit_${id}`, outfit);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error("Save error:", error);
    return c.json({ success: false, error: "Failed to save outfit" }, 500);
  }
});

Deno.serve(app.fetch);