const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserRoleToAdmin(email) {
  const updatedUser = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      role: 'ADMIN',
    },
  });

  console.log('User role updated to ADMIN:', updatedUser);
}

updateUserRoleToAdmin('taj.brzovic@gmail.com')
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
