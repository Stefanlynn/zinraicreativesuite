import type { Express } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { insertContentItemSchema, insertProjectRequestSchema, insertDownloadSchema } from "@shared/schema";

const adminSessions = new Map<string, { userId: number; expires: Date }>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const requireAuth = (req: any, res: any, next: any) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId) {
    return res.status(401).json({ message: "No session token provided" });
  }

  const session = adminSessions.get(sessionId);
  if (!session || session.expires < new Date()) {
    adminSessions.delete(sessionId);
    return res.status(401).json({ message: "Session expired" });
  }

  req.adminUser = { id: session.userId };
  next();
};

export function setupNetlifyRoutes(app: Express) {
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.authenticateUser(username, password);
      
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionId = generateSessionId();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      adminSessions.set(sessionId, {
        userId: user.id,
        expires
      });

      res.json({ 
        message: "Login successful", 
        sessionId,
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", requireAuth, async (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      adminSessions.delete(sessionId);
    }
    res.json({ message: "Logout successful" });
  });

  // Content management routes
  app.get("/api/content", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      let items = await storage.getContentItems(category as string);
      
      if (search) {
        items = await storage.searchContentItems(search as string);
      }
      
      if (featured === 'true') {
        items = await storage.getFeaturedContentItems();
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/content", requireAuth, async (req, res) => {
    try {
      const validatedData = insertContentItemSchema.parse(req.body);
      const item = await storage.createContentItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content item" });
    }
  });

  app.patch("/api/content/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedItem = await storage.updateContentItem(id, updates);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Content item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update content item" });
    }
  });

  app.delete("/api/content/:id", requireAuth, async (req, res) => {
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

  // Download content item
  app.post("/api/content/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getContentItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Content item not found" });
      }

      const downloadData = {
        contentItemId: id,
        userAgent: req.get('User-Agent') || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
      };

      const validatedData = insertDownloadSchema.parse(downloadData);
      await storage.createDownload(validatedData);
      
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

  // Project requests
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

  app.get("/api/project-requests", requireAuth, async (req, res) => {
    try {
      const requests = await storage.getProjectRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project requests" });
    }
  });

  // Stats
  app.get("/api/stats/downloads", requireAuth, async (req, res) => {
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
}