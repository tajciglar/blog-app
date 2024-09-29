const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMultiplePosts() {

    const posts = [
        { title: "Post 1", content: "This is the content of post 1." },
        { title: "Post 2", content: "This is the content of post 2." },
        { title: "Post 3", content: "This is the content of post 3." },
        { title: "Post 4", content: "This is the content of post 4." },
        { title: "Post 5", content: "This is the content of post 5." },
        { title: "Post 6", content: "This is the content of post 6." },
        { title: "Post 7", content: "This is the content of post 7." },
        { title: "Post 8", content: "This is the content of post 8." },
        { title: "Post 9", content: "This is the content of post 9." },
        { title: "Post 10", content: "This is the content of post 10." },
    ];

    // Use createMany to insert multiple posts at once
    const result = await prisma.post.createMany({
        data: posts,
    });

    console.log(`${result.count} posts created`);

}

createMultiplePosts()
    .catch((e) => {
        console.error('Error creating posts:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
