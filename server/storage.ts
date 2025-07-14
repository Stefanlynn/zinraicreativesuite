import { 
  users, 
  contentItems, 
  projectRequests, 
  downloads,
  type User, 
  type InsertUser,
  type ContentItem,
  type InsertContentItem,
  type ProjectRequest,
  type InsertProjectRequest,
  type Download,
  type InsertDownload
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  
  // Content operations
  getContentItems(category?: string): Promise<ContentItem[]>;
  getContentItem(id: number): Promise<ContentItem | undefined>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, updates: Partial<ContentItem>): Promise<ContentItem | undefined>;
  deleteContentItem(id: number): Promise<boolean>;
  searchContentItems(query: string): Promise<ContentItem[]>;
  getFeaturedContentItems(): Promise<ContentItem[]>;
  
  // Project request operations
  getProjectRequests(): Promise<ProjectRequest[]>;
  getProjectRequest(id: number): Promise<ProjectRequest | undefined>;
  createProjectRequest(request: InsertProjectRequest): Promise<ProjectRequest>;
  updateProjectRequest(id: number, updates: Partial<ProjectRequest>): Promise<ProjectRequest | undefined>;
  
  // Download operations
  createDownload(download: InsertDownload): Promise<Download>;
  getDownloadStats(contentItemId: number): Promise<number>;
  incrementDownloadCount(contentItemId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contentItems: Map<number, ContentItem>;
  private projectRequests: Map<number, ProjectRequest>;
  private downloads: Map<number, Download>;
  private currentUserId: number;
  private currentContentId: number;
  private currentProjectId: number;
  private currentDownloadId: number;

  constructor() {
    this.users = new Map();
    this.contentItems = new Map();
    this.projectRequests = new Map();
    this.downloads = new Map();
    this.currentUserId = 1;
    this.currentContentId = 1;
    this.currentProjectId = 1;
    this.currentDownloadId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "andre.butler@zinrai.com",
      password: "6September2008", // In production, this should be hashed
      isAdmin: true
    };
    this.users.set(adminUser.id, adminUser);
    
    // No sample content items - clean slate for testing
    // All content will be added through the admin dashboard
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async getContentItems(category?: string): Promise<ContentItem[]> {
    const items = Array.from(this.contentItems.values());
    if (category) {
      return items.filter(item => item.category === category);
    }
    return items;
  }

  async getContentItem(id: number): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const id = this.currentContentId++;
    const contentItem: ContentItem = { 
      ...item, 
      id,
      downloadCount: 0,
      createdAt: new Date(),
      description: item.description || null,
      featured: item.featured || false
    };
    this.contentItems.set(id, contentItem);
    return contentItem;
  }

  async updateContentItem(id: number, updates: Partial<ContentItem>): Promise<ContentItem | undefined> {
    const item = this.contentItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.contentItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteContentItem(id: number): Promise<boolean> {
    return this.contentItems.delete(id);
  }

  async searchContentItems(query: string): Promise<ContentItem[]> {
    const items = Array.from(this.contentItems.values());
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery) ||
      item.type.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getFeaturedContentItems(): Promise<ContentItem[]> {
    return Array.from(this.contentItems.values()).filter(item => item.featured);
  }

  async getProjectRequests(): Promise<ProjectRequest[]> {
    return Array.from(this.projectRequests.values());
  }

  async getProjectRequest(id: number): Promise<ProjectRequest | undefined> {
    return this.projectRequests.get(id);
  }

  async createProjectRequest(request: InsertProjectRequest): Promise<ProjectRequest> {
    const id = this.currentProjectId++;
    const projectRequest: ProjectRequest = { 
      ...request, 
      id,
      status: "pending",
      createdAt: new Date(),
      referenceFiles: request.referenceFiles || null
    };
    this.projectRequests.set(id, projectRequest);
    return projectRequest;
  }

  async updateProjectRequest(id: number, updates: Partial<ProjectRequest>): Promise<ProjectRequest | undefined> {
    const request = this.projectRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.projectRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async createDownload(download: InsertDownload): Promise<Download> {
    const id = this.currentDownloadId++;
    const downloadRecord: Download = { 
      ...download, 
      id,
      downloadedAt: new Date(),
      contentItemId: download.contentItemId || null,
      userAgent: download.userAgent || null,
      ipAddress: download.ipAddress || null
    };
    this.downloads.set(id, downloadRecord);
    return downloadRecord;
  }

  async getDownloadStats(contentItemId: number): Promise<number> {
    return Array.from(this.downloads.values()).filter(
      download => download.contentItemId === contentItemId
    ).length;
  }

  async incrementDownloadCount(contentItemId: number): Promise<void> {
    const item = this.contentItems.get(contentItemId);
    if (item) {
      item.downloadCount = (item.downloadCount || 0) + 1;
      this.contentItems.set(contentItemId, item);
    }
  }
}

export const storage = new MemStorage();
