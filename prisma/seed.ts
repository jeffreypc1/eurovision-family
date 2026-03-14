import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { readFileSync } from 'fs';

// Load .env
const envContent = readFileSync('.env', 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^(\w+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

const songs = [
  { country: 'Albania', countryCode: 'AL', artist: 'Alis', title: 'Nân', youtubeVideoId: 'b9AdRrA554o' },
  { country: 'Armenia', countryCode: 'AM', artist: 'Simón', title: 'Paloma Rumba', youtubeVideoId: '5EXoK-lgocw' },
  { country: 'Australia', countryCode: 'AU', artist: 'Delta Goodrem', title: 'Eclipse', youtubeVideoId: 'EUMCr1pnaMY' },
  { country: 'Austria', countryCode: 'AT', artist: 'Cosmó', title: 'Tanzschein', youtubeVideoId: 'zPGP9ZphxiY' },
  { country: 'Azerbaijan', countryCode: 'AZ', artist: 'Jiva', title: 'Just Go', youtubeVideoId: 'iMDBPe25JhM' },
  { country: 'Belgium', countryCode: 'BE', artist: 'Essyla', title: 'Dancing on the Ice', youtubeVideoId: '9sfI4g6DWTU' },
  { country: 'Bulgaria', countryCode: 'BG', artist: 'Dara', title: 'Bangaranga', youtubeVideoId: '_pkC9J6BPFY' },
  { country: 'Croatia', countryCode: 'HR', artist: 'Lelek', title: 'Andromeda', youtubeVideoId: 'vl7Jqnw10sU' },
  { country: 'Cyprus', countryCode: 'CY', artist: 'Antigoni', title: 'Jalla', youtubeVideoId: 'TzSs51BiQrE' },
  { country: 'Czechia', countryCode: 'CZ', artist: 'Daniel Žižeka', title: 'Crossroads', youtubeVideoId: '6ea25aRGpLo' },
  { country: 'Denmark', countryCode: 'DK', artist: 'Søren Torpegaard Lund', title: 'Før vi går hjem', youtubeVideoId: 'xKzEP9dwoss' },
  { country: 'Estonia', countryCode: 'EE', artist: 'Vanilla Ninja', title: 'Too Epic To Be True', youtubeVideoId: 'lOiWuol3t3o' },
  { country: 'Finland', countryCode: 'FI', artist: 'Linda Lampenius & Pete Parkkonen', title: 'Liekinheitin', youtubeVideoId: '9bfwNIYb96Q' },
  { country: 'France', countryCode: 'FR', artist: 'Monroe', title: 'Regarde', youtubeVideoId: 'ujoCYrvvTYQ' },
  { country: 'Georgia', countryCode: 'GE', artist: 'Bzikebi', title: 'On Replay', youtubeVideoId: 'coh-lygCINY' },
  { country: 'Germany', countryCode: 'DE', artist: 'Sarah Engels', title: 'Fire', youtubeVideoId: 'AzvRc3eH_rA' },
  { country: 'Greece', countryCode: 'GR', artist: 'Akylas', title: 'Ferto', youtubeVideoId: 'NGwNTd_DA9s' },
  { country: 'Israel', countryCode: 'IL', artist: 'Noam Bettan', title: 'Michelle', youtubeVideoId: 'xWCnWSoG8nI' },
  { country: 'Italy', countryCode: 'IT', artist: 'Sal Da Vinci', title: 'Per sempre sì', youtubeVideoId: 'V406FAGkhyQ' },
  { country: 'Latvia', countryCode: 'LV', artist: 'Atvara', title: 'Ēnā', youtubeVideoId: 'ylj-kHKEFMY' },
  { country: 'Lithuania', countryCode: 'LT', artist: 'Lion Ceccah', title: 'Sólo quiero más', youtubeVideoId: '0H-PXnbhG7A' },
  { country: 'Luxembourg', countryCode: 'LU', artist: 'Eva Marija', title: 'Mother Nature', youtubeVideoId: 'DmVfJSRqgnI' },
  { country: 'Malta', countryCode: 'MT', artist: 'Aidan', title: 'Bella', youtubeVideoId: 'CW6mQLBh6Js' },
  { country: 'Moldova', countryCode: 'MD', artist: 'Satoshi', title: 'Viva, Moldova!', youtubeVideoId: 'SViojHjNSzc' },
  { country: 'Montenegro', countryCode: 'ME', artist: 'Tamara Živković', title: 'Nova zora', youtubeVideoId: '59hsYOMCQGY' },
  { country: 'Norway', countryCode: 'NO', artist: 'Jonas Lovv', title: 'Ya ya ya', youtubeVideoId: 'MasllzWk_bQ' },
  { country: 'Poland', countryCode: 'PL', artist: 'Alicja', title: 'Pray', youtubeVideoId: 'q78cnYIoF9Y' },
  { country: 'Portugal', countryCode: 'PT', artist: 'Bandidos do Cante', title: 'Rosa', youtubeVideoId: 'jyHaE6GqaaQ' },
  { country: 'Romania', countryCode: 'RO', artist: 'Alexandra Căpitănescu', title: 'Choke Me', youtubeVideoId: 'yn0YmI0dPb8' },
  { country: 'San Marino', countryCode: 'SM', artist: 'Senhit', title: 'Superstar', youtubeVideoId: 'wOQe-fQSFxg' },
  { country: 'Serbia', countryCode: 'RS', artist: 'Lavina', title: 'Kraj mene', youtubeVideoId: 'FJTLKBOOE98' },
  { country: 'Sweden', countryCode: 'SE', artist: 'Felicia', title: 'My System', youtubeVideoId: 'ibbfS8iG450' },
  { country: 'Switzerland', countryCode: 'CH', artist: 'Veronica Fusaro', title: 'Alice', youtubeVideoId: 'PfpYGAzW5dM' },
  { country: 'Ukraine', countryCode: 'UA', artist: 'Lelëka', title: 'Ridnym', youtubeVideoId: 'SoEXezpblAc' },
  { country: 'United Kingdom', countryCode: 'GB', artist: 'Look Mum No Computer', title: 'Eins, Zwei, Drei', youtubeVideoId: 'niMKvJ-Itq8' },
];

const familyMembers = [
  { name: 'Jeff', emoji: '🎤', color: '#E91E8C' },
];

async function main() {
  console.log('🎵 Seeding Eurovision Family Ranker database...\n');

  // Clear existing data
  await prisma.rating.deleteMany();
  await prisma.song.deleteMany();
  await prisma.familyMember.deleteMany();

  // Seed songs
  for (const song of songs) {
    await prisma.song.create({ data: { ...song, year: 2026 } });
  }
  console.log(`✅ Added ${songs.length} Eurovision 2026 songs`);

  // Seed family members
  for (const member of familyMembers) {
    await prisma.familyMember.create({ data: member });
  }
  console.log(`✅ Added ${familyMembers.length} family member(s)`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('Run `npm run dev` to start the app.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
