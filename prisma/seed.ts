import { PrismaClient } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

async function main() {
  const prismaClient = prisma;

  console.log('Seeding database...');

  const user = await prismaClient.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  console.log('Created user:', user.email);

  await prismaClient.recipe.createMany({
    data: [
      {
        userId: user.id,
        title: 'Margherita Pizza',
        imageUri: 'https://images.pexels.com/photos/82566/pexels-photo-82566.jpeg',
        ingredients: [
          { name: 'Pizza Dough', amount: '1 ball (approx 250g)' },
          { name: 'Tomato Sauce', amount: '3-4 tbsp' },
          { name: 'Fresh Mozzarella', amount: '150g, sliced' },
          { name: 'Fresh Basil Leaves', amount: 'Handful' },
          { name: 'Olive Oil', amount: '1 tbsp' },
          { name: 'Salt', amount: 'To taste' },
        ],
        instructions: [
          'Preheat oven to 250°C (480°F) with a pizza stone if available.',
          'Stretch the pizza dough into a 12-inch circle on a floured surface.',
          'Spread tomato sauce evenly, leaving a 1-inch border.',
          'Arrange mozzarella slices on top.',
          'Bake for 8-10 minutes until crust is golden and cheese bubbles.',
          'Top with fresh basil, drizzle with olive oil, season with salt, and serve.',
        ],
        youtubeVideoId: 'JmhCF7AqiR4',
      },
      {
        userId: null,
        title: 'Classic Caesar Salad',
        imageUri: 'https://images.pexels.com/photos/1192077/pexels-photo-1192077.jpeg',
        ingredients: [
          { name: 'Romaine Lettuce', amount: '1 large head, chopped' },
          { name: 'Parmesan Cheese', amount: '1/2 cup, shaved' },
          { name: 'Croutons', amount: '1 cup' },
          { name: 'Caesar Dressing', amount: '3/4 cup' },
          { name: 'Black Pepper', amount: 'To taste' },
        ],
        instructions: [
          'Wash and thoroughly dry the romaine lettuce.',
          'Place lettuce in a large salad bowl.',
          'Add Caesar dressing and toss to coat evenly.',
          'Top with shaved parmesan and croutons.',
          'Finish with freshly ground black pepper and serve immediately.',
        ],
        youtubeVideoId: 'ZZO3ucsoxgM',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
