import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectRequestSchema, insertDownloadSchema, insertContentItemSchema } from "@shared/schema";
import { z } from "zod";

// Simple session store for admin auth
const adminSessions = new Map<string, { userId: number; expires: Date }>();

// Generate simple session ID
function generateSessionId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Middleware to check admin auth
const requireAdmin = async (req: any, res: any, next: any) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId) {
    return res.status(401).json({ message: "No session token provided" });
  }
  
  const session = adminSessions.get(sessionId);
  if (!session || session.expires < new Date()) {
    adminSessions.delete(sessionId);
    return res.status(401).json({ message: "Invalid or expired session" });
  }
  
  const user = await storage.getUser(session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  req.adminUser = user;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.authenticateUser(username, password);
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: "Invalid credentials or not an admin" });
      }
      
      // Create session
      const sessionId = generateSessionId();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      adminSessions.set(sessionId, { userId: user.id, expires: expiresAt });
      
      res.json({ 
        token: sessionId,
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin }
      });
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      adminSessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  // Admin content management routes
  app.post("/api/admin/content", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertContentItemSchema.parse(req.body);
      const item = await storage.createContentItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content item" });
    }
  });

  app.put("/api/admin/content/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updateContentItem(id, updates);
      
      if (!item) {
        return res.status(404).json({ message: "Content item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update content item" });
    }
  });

  app.delete("/api/admin/content/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContentItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Content item not found" });
      }
      
      res.json({ message: "Content item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content item" });
    }
  });

  app.get("/api/admin/content", requireAdmin, async (req, res) => {
    try {
      const items = await storage.getContentItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });

  app.get("/api/admin/project-requests", requireAdmin, async (req, res) => {
    try {
      const requests = await storage.getProjectRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project requests" });
    }
  });

  // Public content routes
  // Get all content items or filter by category
  app.get("/api/content", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      
      let items;
      if (search) {
        items = await storage.searchContentItems(search as string);
      } else if (featured === 'true') {
        items = await storage.getFeaturedContentItems();
      } else {
        items = await storage.getContentItems(category as string);
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });

  // Get single content item
  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getContentItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Content item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content item" });
    }
  });

  // Download content item
  app.post("/api/content/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getContentItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Content item not found" });
      }

      // Create download record
      const downloadData = {
        contentItemId: id,
        userAgent: req.get('User-Agent') || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
      };

      const validatedData = insertDownloadSchema.parse(downloadData);
      await storage.createDownload(validatedData);
      
      // Increment download count
      await storage.incrementDownloadCount(id);
      
      res.json({ 
        message: "Download recorded successfully",
        fileUrl: item.fileUrl,
        fileName: `${item.title}.${item.type === 'video' ? 'mp4' : item.type === 'graphic' ? 'jpg' : 'zip'}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid download data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process download" });
    }
  });

  // Submit project request
  app.post("/api/project-requests", async (req, res) => {
    try {
      const validatedData = insertProjectRequestSchema.parse(req.body);
      const projectRequest = await storage.createProjectRequest(validatedData);
      
      res.status(201).json({ 
        message: "Project request submitted successfully",
        id: projectRequest.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit project request" });
    }
  });

  // Get all project requests (admin endpoint)
  app.get("/api/project-requests", async (req, res) => {
    try {
      const requests = await storage.getProjectRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project requests" });
    }
  });

  // Get single project request
  app.get("/api/project-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getProjectRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Project request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project request" });
    }
  });

  // Update project request status
  app.patch("/api/project-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedRequest = await storage.updateProjectRequest(id, updates);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Project request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project request" });
    }
  });

  // Get download statistics
  app.get("/api/stats/downloads", async (req, res) => {
    try {
      const items = await storage.getContentItems();
      const stats = await Promise.all(items.map(async (item) => ({
        id: item.id,
        title: item.title,
        downloadCount: item.downloadCount || 0,
        category: item.category
      })));
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch download statistics" });
    }
  });

  // Only create HTTP server if not in serverless environment
  if (!process.env.NETLIFY) {
    const httpServer = createServer(app);
    return httpServer;
  }
  
  // Return a mock server for Netlify functions
  return null as any;
}
