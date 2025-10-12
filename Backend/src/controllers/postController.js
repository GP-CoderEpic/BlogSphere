import dotenv from 'dotenv';
import { Client, Databases, Storage, ID, Query } from 'appwrite';
import { validationResult } from 'express-validator';
import fs from 'fs';

dotenv.config();

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setDevKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Create new post
export const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, content, slug, status } = req.body;
    const userId = req.user.userId;

    // Debug logging (commented out for production)
    // console.log('Creating post for user:', userId);
    // console.log('Post data:', { title, content: content?.substring(0, 50) + '...', slug, status });

    // Create a client with user session for proper permissions
    // For now, we'll use the API key approach but need to set proper permissions
    // The collection should have "Any" role with "Create" permission for this to work
    
    // Handle file upload
    let featuredImage = null;
    if (req.file) {
      console.log('File received:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });
      
      try {
        // Read file from disk and create a File object for Appwrite
        const fileBuffer = fs.readFileSync(req.file.path);
        const file = new File([fileBuffer], req.file.originalname, {
          type: req.file.mimetype,
        });
        
        const uploadedFile = await storage.createFile(
          process.env.APPWRITE_BUCKET_ID,
          ID.unique(),
          file
        );
        
        featuredImage = uploadedFile.$id;
        
        // Clean up temporary file
        fs.unlinkSync(req.file.path);
        console.log('File uploaded successfully:', featuredImage);
      } catch (fileError) {
        console.error('File upload error:', fileError);
        // Clean up temporary file on error
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        throw new Error('Failed to upload image: ' + fileError.message);
      }
    }

    // Create post in database
    const post = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      ID.unique(),
      {
        title,
        content,
        slug,
        status: status || 'active',
        userId,
        featuredImage: featuredImage || '' // Provide empty string as default
        // createdAt and updatedAt are handled automatically by Appwrite
      }
    );

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      message: 'Failed to create post', 
      error: error.message 
    });
  }
};

// Get all posts with pagination
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active', userId } = req.query;
    
    // Build queries
    const queries = [
      Query.equal('status', status),
      Query.limit(parseInt(limit)),
      Query.offset((parseInt(page) - 1) * parseInt(limit)),
      Query.orderDesc('$createdAt') // Use Appwrite's built-in $createdAt field
    ];

    
    if (userId) {
      queries.push(Query.equal('userId', userId));
    }

    const posts = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      queries
    );

    res.json({
      posts: posts.documents,
      total: posts.total,
      page: parseInt(page),
      totalPages: Math.ceil(posts.total / parseInt(limit)),
      hasNextPage: parseInt(page) < Math.ceil(posts.total / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch posts', 
      error: error.message 
    });
  }
};


export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const posts = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      [Query.equal('slug', slug)]
    );

    if (posts.documents.length === 0) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    res.json({ 
      post: posts.documents[0] 
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch post', 
      error: error.message 
    });
  }
};


export const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { title, content, slug, status } = req.body;
    const userId = req.user.userId;

    
    const existingPost = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      id
    );

    if (existingPost.userId !== userId) {
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own posts.' 
      });
    }

    // Handle file upload if exists
    let featuredImage = existingPost.featuredImage;
    if (req.file) {
      
      if (existingPost.featuredImage) {
        try {
          await storage.deleteFile(
            process.env.APPWRITE_BUCKET_ID,
            existingPost.featuredImage
          );
        } catch (deleteError) {
          console.log('Error deleting old image:', deleteError);
        }
      }
      
      
      const file = await storage.createFile(
        process.env.APPWRITE_BUCKET_ID,
        ID.unique(),
        req.file
      );
      featuredImage = file.$id;
    }

    
    const post = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      id,
      {
        title,
        content,
        slug,
        status,
        featuredImage,
        updatedAt: new Date().toISOString()
      }
    );

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    if (error.code === 404) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }
    res.status(500).json({ 
      message: 'Failed to update post', 
      error: error.message 
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    
    const existingPost = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      id
    );

    if (existingPost.userId !== userId) {
      return res.status(403).json({ 
        message: 'Access denied. You can only delete your own posts.' 
      });
    }

    // Delete featured image if exists
    if (existingPost.featuredImage) {
      try {
        await storage.deleteFile(
          process.env.APPWRITE_BUCKET_ID,
          existingPost.featuredImage
        );
      } catch (deleteError) {
        console.log('Error deleting image:', deleteError);
      }
    }

    
    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      id
    );

    res.json({ 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('Delete post error:', error);
    if (error.code === 404) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }
    res.status(500).json({ 
      message: 'Failed to delete post', 
      error: error.message 
    });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    const queries = [
      Query.equal('userId', userId),
      Query.limit(parseInt(limit)),
      Query.offset((parseInt(page) - 1) * parseInt(limit)),
      Query.orderDesc('$createdAt') // Use Appwrite's built-in $createdAt field
    ];

    
    if (status) {
      queries.push(Query.equal('status', status));
    }

    const posts = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POST_COLLECTION_ID,
      queries
    );

    res.json({
      posts: posts.documents,
      total: posts.total,
      page: parseInt(page),
      totalPages: Math.ceil(posts.total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user posts', 
      error: error.message 
    });
  }
};