import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const songs = [
  { country: 'Albania', countryCode: 'AL', artist: 'Alis', title: 'Nân', youtubeVideoId: 'b9AdRrA554o' },
  { country: 'Armenia', countryCode: 'AM', artist: 'Simón', title: 'Paloma Rumba', youtubeVideoId: '5EXoK-lgocw' },
  { country: 'Australia', countryCode: 'AU', artist: 'Delta Goodrem', title: 'Eclipse', youtubeVideoId: 'KsFY11nOQDo' },
  { country: 'Austria', countryCode: 'AT', artist: 'Cosmó', title: 'Tanzschein', youtubeVideoId: 'HoBaDtTcSBA' },
  { country: 'Azerbaijan', countryCode: 'AZ', artist: 'Jiva', title: 'Just Go', youtubeVideoId: '1OvrUqqQUF8' },
  { country: 'Belgium', countryCode: 'BE', artist: 'Essyla', title: 'Dancing on the Ice', youtubeVideoId: '9sfI4g6DWTU' },
  { country: 'Bulgaria', countryCode: 'BG', artist: 'Dara', title: 'Bangaranga', youtubeVideoId: '_pkC9J6BPFY' },
  { country: 'Croatia', countryCode: 'HR', artist: 'Lelek', title: 'Andromeda', youtubeVideoId: 'y1MGvQTWZ8I' },
  { country: 'Cyprus', countryCode: 'CY', artist: 'Antigoni', title: 'Jalla', youtubeVideoId: 'TzSs51BiQrE' },
  { country: 'Czechia', countryCode: 'CZ', artist: 'Daniel Žižeka', title: 'Crossroads', youtubeVideoId: '6ea25aRGpLo' },
  { country: 'Denmark', countryCode: 'DK', artist: 'Søren Torpegaard Lund', title: 'Før vi går hjem', youtubeVideoId: 'xKzEP9dwoss' },
  { country: 'Estonia', countryCode: 'EE', artist: 'Vanilla Ninja', title: 'Too Epic To Be True', youtubeVideoId: 'pf-oPWrkXFw' },
  { country: 'Finland', countryCode: 'FI', artist: 'Linda Lampenius & Pete Parkkonen', title: 'Liekinheitin', youtubeVideoId: '9bfwNIYb96Q' },
  { country: 'France', countryCode: 'FR', artist: 'Monroe', title: 'Regarde', youtubeVideoId: 'zEZfyGMuQLo' },
  { country: 'Georgia', countryCode: 'GE', artist: 'Bzikebi', title: 'On Replay', youtubeVideoId: 'coh-lygCINY' },
  { country: 'Germany', countryCode: 'DE', artist: 'Sarah Engels', title: 'Fire', youtubeVideoId: '0UhMcQOqGnQ' },
  { country: 'Greece', countryCode: 'GR', artist: 'Akylas', title: 'Ferto', youtubeVideoId: 'VlwIKCFYQyw' },
  { country: 'Israel', countryCode: 'IL', artist: 'Noam Bettan', title: 'Michelle', youtubeVideoId: 'iYYHAqrD-L8' },
  { country: 'Italy', countryCode: 'IT', artist: 'Sal Da Vinci', title: 'Per sempre sì', youtubeVideoId: 'IJ6punBGiUA' },
  { country: 'Latvia', countryCode: 'LV', artist: 'Atvara', title: 'Ēnā', youtubeVideoId: 'ylj-kHKEFMY' },
  { country: 'Lithuania', countryCode: 'LT', artist: 'Lion Ceccah', title: 'Sólo quiero más', youtubeVideoId: 'mPZMHqSsoeo' },
  { country: 'Luxembourg', countryCode: 'LU', artist: 'Eva Marija', title: 'Mother Nature', youtubeVideoId: '4WA162bl1Fo' },
  { country: 'Malta', countryCode: 'MT', artist: 'Aidan', title: 'Bella', youtubeVideoId: 'eqg8lrxGL7o' },
  { country: 'Moldova', countryCode: 'MD', artist: 'Satoshi', title: 'Viva, Moldova!', youtubeVideoId: 'k340WWX6zHk' },
  { country: 'Montenegro', countryCode: 'ME', artist: 'Tamara Živković', title: 'Nova zora', youtubeVideoId: '6TfmkUXeKf0' },
  { country: 'Norway', countryCode: 'NO', artist: 'Jonas Lovv', title: 'Ya ya ya', youtubeVideoId: '5W3tQkxb97Y' },
  { country: 'Poland', countryCode: 'PL', artist: 'Alicja', title: 'Pray', youtubeVideoId: '2ExUZVqB-TM' },
  { country: 'Portugal', countryCode: 'PT', artist: 'Bandidos do Cante', title: 'Rosa', youtubeVideoId: 'TryYWkk69Tg' },
  { country: 'Romania', countryCode: 'RO', artist: 'Alexandra Căpitănescu', title: 'Choke Me', youtubeVideoId: 'C82LqToyMe4' },
  { country: 'San Marino', countryCode: 'SM', artist: 'Senhit', title: 'Superstar', youtubeVideoId: 'xR33DSWLiv8' },
  { country: 'Serbia', countryCode: 'RS', artist: 'Lavina', title: 'Kraj mene', youtubeVideoId: '931yYfZH2F8' },
  { country: 'Sweden', countryCode: 'SE', artist: 'Felicia', title: 'My System', youtubeVideoId: 'GcyN-64k-Lk' },
  { country: 'Switzerland', countryCode: 'CH', artist: 'Veronica Fusaro', title: 'Alice', youtubeVideoId: 'PfpYGAzW5dM' },
  { country: 'Ukraine', countryCode: 'UA', artist: 'Lelëka', title: 'Ridnym', youtubeVideoId: 'qxEeWgjbxx0' },
  { country: 'United Kingdom', countryCode: 'GB', artist: 'Look Mum No Computer', title: 'Eins, Zwei, Drei', youtubeVideoId: 'RB2cEOxo_as' },
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
