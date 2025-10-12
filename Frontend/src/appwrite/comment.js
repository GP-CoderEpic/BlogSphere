import conf from '../conf/conf.js';
import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client();
client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

export const commentService = {
    async createComment(postId, content, userId, userName, userEmail){
        return await databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCommentId,
            ID.unique(),
            {
                postId,
                content,
                userId,
                userName,
                userEmail,
                createdAt: new Date().toISOString()
            }
        );
    },

    async getCommentsByPostId(postId) {
        return await databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCommentId,
            [
               Query.equal('postId', postId),
                Query.orderDesc('$createdAt'),
                Query.limit(50)
            ]
        );
    },

    async updateComment(commentId, content) {
        return await databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCommentId,
            commentId,
            {
                content,
            }
        );
    },

    async deleteComment(commentId) {
        return await databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCommentId,
            commentId
        );
    }
    
};

