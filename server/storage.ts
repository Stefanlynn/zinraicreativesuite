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
    
    // Initialize with sample content items
    const sampleItems: Omit<ContentItem, 'id'>[] = [
      {
        title: "Business Card Template",
        description: "Professional business card design",
        category: "general",
        type: "template",
        fileUrl: "/assets/business-card-template.psd",
        thumbnailUrl: "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
      },
      {
        title: "Letter Template",
        description: "Standard business letter format",
        category: "general",
        type: "template",
        fileUrl: "/assets/letter-template.docx",
        thumbnailUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Logo Design Bundle",
        description: "Professional logo templates",
        category: "general",
        type: "bundle",
        fileUrl: "/assets/logo-bundle.zip",
        thumbnailUrl: "https://images.unsplash.com/photo-1621556008648-88d56d96e6c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Instagram Reels Template",
        description: "Motivational quote design",
        category: "social-media",
        type: "video",
        fileUrl: "/assets/sample-reel.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=600",
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
      },
      {
        title: "Facebook Post Graphic",
        description: "Brand awareness design",
        category: "social-media",
        type: "graphic",
        fileUrl: "/assets/facebook-post.jpg",
        thumbnailUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "LinkedIn Carousel",
        description: "Professional growth tips",
        category: "social-media",
        type: "graphic",
        fileUrl: "/assets/linkedin-carousel.pdf",
        thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "YouTube Thumbnail",
        description: "Educational content design",
        category: "social-media",
        type: "graphic",
        fileUrl: "/assets/youtube-thumbnail.jpg",
        thumbnailUrl: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Training Video Series",
        description: "Leadership development modules",
        category: "field-tools",
        type: "video",
        fileUrl: "/assets/training-video.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225",
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
      },
      {
        title: "Presentation Template",
        description: "Brand promoter materials",
        category: "field-tools",
        type: "template",
        fileUrl: "/assets/presentation-template.pptx",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Process Infographic",
        description: "Step-by-step guides",
        category: "field-tools",
        type: "graphic",
        fileUrl: "/assets/process-infographic.jpg",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=533",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Event Promo Video",
        description: "Leadership conference 2024",
        category: "events",
        type: "video",
        fileUrl: "/assets/event-promo.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225",
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
      },
      {
        title: "Event Flyer",
        description: "Networking event design",
        category: "events",
        type: "graphic",
        fileUrl: "/assets/event-flyer.jpg",
        thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=533",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Social Media Kit",
        description: "Complete event package",
        category: "events",
        type: "bundle",
        fileUrl: "/assets/social-media-kit.zip",
        thumbnailUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "T-Shirt Mockup",
        description: "Brand merchandise design",
        category: "store",
        type: "mockup",
        fileUrl: "/assets/tshirt-mockup.psd",
        thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Coffee Mug Design",
        description: "Daily motivation piece",
        category: "store",
        type: "mockup",
        fileUrl: "/assets/mug-design.psd",
        thumbnailUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Sticker Pack",
        description: "Brand awareness kit",
        category: "store",
        type: "bundle",
        fileUrl: "/assets/sticker-pack.zip",
        thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
      {
        title: "Business Card",
        description: "Professional networking",
        category: "store",
        type: "template",
        fileUrl: "/assets/business-card.psd",
        thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        downloadCount: 0,
        featured: false,
        createdAt: new Date(),
      },
    ];

    sampleItems.forEach(item => {
      const id = this.currentContentId++;
      this.contentItems.set(id, { ...item, id });
    });
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
