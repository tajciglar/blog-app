const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function newPost(req, res) {
    const data = req.body;

    try{
        const result = await prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
            }
        })
        res.json(result);
    } catch (err) {
        console.error(err);
    }
}

async function deletePost(req, res) {
    const postId = req.params.postId;

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const deletedPost = await prisma.post.delete({
            where: { id: postId },
        });

        return res.status(200).json({ message: 'Post deleted successfully', deletedPost });

    } catch (err) {
        console.error('Error deleting post:', err);

        return res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
}

async function editPost(req, res) {

    const data = req.body;
    const postId = req.params.postId;
    try {
        const updatedPost =  await prisma.post.update({
            where: {
                id: postId, 
            },
            data: {
                title: data.title,
                content: data.content,
            }
        })
        res.json(updatedPost);
        
    } catch (err) {
        console.error(err);
    }
    
}

module.exports = {
    deletePost,
    editPost,
    newPost,
};
