import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^(\w+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter } as any);

const data = JSON.parse(readFileSync('eurovision_data.json', 'utf-8'));

async function main() {
  console.log('🎵 Seeding Eurovision 2024 & 2025...\n');

  for (const [key, year] of [['eurovision2024', 2024], ['eurovision2025', 2025]] as const) {
    const songs = data[key];
    let count = 0;
    for (const song of songs) {
      // Check if already exists
      const existing = await prisma.song.findFirst({
        where: { country: song.country, year: year as number },
      });
      if (existing) continue;

      await prisma.song.create({
        data: {
          country: song.country,
          countryCode: song.countryCode,
          artist: song.artist,
          title: song.title,
          youtubeVideoId: song.youtubeVideoId || null,
          year: year as number,
        },
      });
      count++;
    }
    console.log(`  ✅ ${year}: Added ${count} songs (${songs.length} total entries)`);
  }

  console.log('\n🎉 Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
