import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  try {
    // Create a specific admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com', // Use a memorable email
        name: 'Admin User',
        password: hashedPassword, // Hashed password
        role: 'ADMIN',
      },
    });

    console.log('Admin account created:');
    console.log(`Email: ${admin.email}`);
    console.log('Password: admin123');

    // Create additional random users
    const users = [admin];
    for (let i = 0; i < 9; i++) {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.firstName(),
          password: await bcrypt.hash(faker.internet.password(12), 10), // Hashed password
          role: 'USER',
        },
      });
      users.push(user);
    }

    // Create posts and comments
    for (let i = 0; i < 20; i++) {
      const post = await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(2),
          createdAt: faker.date.past(),
        },
      });

      // Add comments to the post
      for (let j = 0; j < 5; j++) {
        await prisma.comment.create({
          data: {
            postId: post.id,
            authorId: faker.helpers.arrayElement(users).id,
            content: faker.lorem.sentence(),
          },
        });
      }
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();