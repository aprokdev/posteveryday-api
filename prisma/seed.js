import { PrismaClient } from '@prisma/client';
import posts from './posts.json';
import users from './users.json';

const prisma = new PrismaClient();

export async function main() {
    console.log('[Elevator Music Cue] 🎸');
    for (const user of users) {
        await prisma.user.create({
            data: { ...user },
        });
    }
    for (const post of posts) {
        const { created, id, ...rest } = post;
        await prisma.post.create({
            data: { ...rest },
        });
    }
    console.log('Done 🎉');
}

main();
