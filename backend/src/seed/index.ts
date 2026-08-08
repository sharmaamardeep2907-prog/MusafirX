import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { User, State, Destination } from '../config/database';
import { indianStates } from './states';

const destData = [
  { n: 'Jaipur', s: 'jaipur', st: 'rajasthan', t: 'Heritage', bs: 'Oct-Mar', bd: '₹8,000-15,000', r: 4.7, tr: true, tg: ['heritage','forts','shopping','food'], d: 'The Pink City — a magnificent blend of royal heritage and modern vibrancy. From Amer Fort to bustling bazaars.' },
  { n: 'Udaipur', s: 'udaipur', st: 'rajasthan', t: 'Heritage', bs: 'Oct-Mar', bd: '₹10,000-20,000', r: 4.8, tr: true, tg: ['lakes','romance','heritage'], d: 'City of Lakes — arguably the most romantic city in India with shimmering Lake Pichola.' },
  { n: 'Jodhpur', s: 'jodhpur', st: 'rajasthan', t: 'Heritage', bs: 'Oct-Mar', bd: '₹6,000-12,000', r: 4.6, tg: ['forts','blue-city'], d: 'The Blue City rises from the Thar Desert. Dominated by Mehrangarh Fort.' },
  { n: 'Jaisalmer', s: 'jaisalmer', st: 'rajasthan', t: 'Desert', bs: 'Oct-Feb', bd: '₹7,000-14,000', r: 4.6, tg: ['desert','forts','camel'], d: 'The Golden City — camel safaris, desert camping, haunted Kuldhara village.' },
  { n: 'North Goa', s: 'north-goa', st: 'goa', t: 'Beach', bs: 'Nov-Feb', bd: '₹8,000-20,000', r: 4.5, tr: true, tg: ['beaches','nightlife'], d: 'The vibrant heart of Goa — Baga, Calangute, Anjuna. Beach shacks and legendary nightlife.' },
  { n: 'South Goa', s: 'south-goa', st: 'goa', t: 'Beach', bs: 'Nov-Feb', bd: '₹10,000-25,000', r: 4.7, tg: ['beaches','luxury'], d: 'Pristine beaches like Palolem and Agonda, luxury resorts, quiet fishing villages.' },
  { n: 'Munnar', s: 'munnar', st: 'kerala', t: 'Hill Station', bs: 'Sep-Mar', bd: '₹6,000-15,000', r: 4.7, tr: true, tg: ['tea','hills','nature'], d: 'Emerald tea plantations across misty hills. Walk through tea gardens, spot Nilgiri Tahr.' },
  { n: 'Alleppey', s: 'alleppey', st: 'kerala', t: 'Backwaters', bs: 'Sep-Mar', bd: '₹8,000-18,000', r: 4.6, tr: true, tg: ['backwaters','houseboat'], d: 'Venice of the East — glide through palm-fringed backwaters on a traditional houseboat.' },
  { n: 'Kochi', s: 'kochi', st: 'kerala', t: 'Heritage', bs: 'Sep-Mar', bd: '₹5,000-12,000', r: 4.5, tg: ['heritage','food','art'], d: 'Chinese fishing nets, Portuguese churches, Dutch palaces, and contemporary art scene.' },
  { n: 'Wayanad', s: 'wayanad', st: 'kerala', t: 'Nature', bs: 'Oct-May', bd: '₹5,000-12,000', r: 4.5, tg: ['nature','wildlife'], d: 'Misty mountains, ancient caves, and wildlife sanctuaries. Trek Chembra Peak.' },
  { n: 'Varkala', s: 'varkala', st: 'kerala', t: 'Beach', bs: 'Oct-Mar', bd: '₹4,000-10,000', r: 4.4, hg: true, tg: ['beach','cliff'], d: 'A stunning cliffside beach. Red laterite cliffs, golden sand, cliff-top seafood.' },
  { n: 'Manali', s: 'manali', st: 'himachal-pradesh', t: 'Hill Station', bs: 'Mar-Jun, Oct-Feb', bd: '₹6,000-15,000', r: 4.5, tg: ['adventure','snow','hills'], d: 'Adventure capital — rafting, paragliding, skiing. Old Manali charms with hippie cafes.' },
  { n: 'Dharamshala', s: 'dharamshala', st: 'himachal-pradesh', t: 'Hill Station', bs: 'Mar-Jun, Oct-Feb', bd: '₹4,000-10,000', r: 4.5, tg: ['buddhism','tibetan'], d: 'Little Lhasa — home to the Dalai Lama. Buddhist teachings, meditation, Dhauladhar views.' },
  { n: 'Spiti Valley', s: 'spiti-valley', st: 'himachal-pradesh', t: 'Adventure', bs: 'May-Oct', bd: '₹12,000-25,000', r: 4.8, tg: ['adventure','buddhism','road-trip'], d: 'Cold desert mountain valley with ancient monasteries and the Milky Way at night.' },
  { n: 'Tirthan Valley', s: 'tirthan-valley', st: 'himachal-pradesh', t: 'Nature', bs: 'Mar-Jun, Oct-Nov', bd: '₹3,000-8,000', r: 4.6, hg: true, tg: ['hidden-gem','fishing'], d: 'A pristine valley. Crystal-clear Tirthan River with trout fishing.' },
  { n: 'Rishikesh', s: 'rishikesh', st: 'uttarakhand', t: 'Spiritual', bs: 'Sep-Nov, Mar-May', bd: '₹4,000-10,000', r: 4.7, tr: true, tg: ['yoga','spiritual'], d: 'Yoga Capital of the World. World-class yoga, rafting, spectacular Ganga Aarti.' },
  { n: 'Nainital', s: 'nainital', st: 'uttarakhand', t: 'Hill Station', bs: 'Mar-Jun, Oct-Feb', bd: '₹5,000-12,000', r: 4.4, tg: ['lake','hills'], d: 'Lake District of India. Emerald Naini Lake surrounded by seven hills.' },
  { n: 'Srinagar', s: 'srinagar', st: 'jammu-and-kashmir', t: 'Nature', bs: 'Apr-Oct', bd: '₹8,000-18,000', r: 4.6, tg: ['houseboat','gardens'], d: 'Summer capital of Kashmir. Traditional houseboats on Dal Lake, Mughal Gardens.' },
  { n: 'Gulmarg', s: 'gulmarg', st: 'jammu-and-kashmir', t: 'Adventure', bs: 'Dec-Mar, May-Oct', bd: '₹10,000-25,000', r: 4.7, tg: ['skiing','snow'], d: 'Asia\'s premier ski destination. Ride the Gulmarg Gondola.' },
  { n: 'Leh', s: 'leh', st: 'ladakh', t: 'Adventure', bs: 'May-Oct', bd: '₹15,000-35,000', r: 4.8, tr: true, tg: ['adventure','buddhism','road-trip'], d: 'The Land of High Passes — surreal desert, Buddhist monasteries, epic road trips.' },
  { n: 'Nubra Valley', s: 'nubra-valley', st: 'ladakh', t: 'Adventure', bs: 'Jun-Sep', bd: '₹12,000-25,000', r: 4.7, tg: ['adventure','desert','camel'], d: 'Cold desert with Bactrian camels. Diskit Monastery with 32-meter Maitreya Buddha.' },
  { n: 'Hampi', s: 'hampi', st: 'karnataka', t: 'Heritage', bs: 'Oct-Feb', bd: '₹4,000-10,000', r: 4.7, tg: ['heritage','ruins','backpacking'], d: 'Surreal boulder landscape with Vijayanagara Empire ruins. An open-air museum.' },
  { n: 'Coorg', s: 'coorg', st: 'karnataka', t: 'Hill Station', bs: 'Oct-Mar', bd: '₹5,000-12,000', r: 4.5, tg: ['coffee','hills','nature'], d: 'Scotland of India. Misty coffee plantations, Abbey Falls, Western Ghats trekking.' },
  { n: 'Varanasi', s: 'varanasi', st: 'uttar-pradesh', t: 'Spiritual', bs: 'Oct-Mar', bd: '₹4,000-12,000', r: 4.8, tr: true, tg: ['spiritual','ganga','culture','food'], d: 'The oldest living city. Ganga Aarti at Dashashwamedh Ghat, sunrise boat rides.' },
  { n: 'Agra', s: 'agra', st: 'uttar-pradesh', t: 'Heritage', bs: 'Oct-Mar', bd: '₹5,000-12,000', r: 4.5, tg: ['heritage','taj-mahal'], d: 'Home to the Taj Mahal — the greatest monument to love. Agra Fort and Fatehpur Sikri.' },
  { n: 'Lucknow', s: 'lucknow', st: 'uttar-pradesh', t: 'Heritage', bs: 'Oct-Mar', bd: '₹4,000-10,000', r: 4.4, tg: ['food','heritage','culture'], d: 'City of Nawabs. Awadhi cuisine, Bara Imambara, legendary Tunday kebabs.' },
  { n: 'Khajuraho', s: 'khajuraho', st: 'madhya-pradesh', t: 'Heritage', bs: 'Oct-Mar', bd: '₹5,000-12,000', r: 4.6, tg: ['heritage','temples','unesco'], d: 'Temples of love and life. Exquisite 10th-century sculptures. UNESCO World Heritage.' },
  { n: 'Orchha', s: 'orchha', st: 'madhya-pradesh', t: 'Heritage', bs: 'Oct-Mar', bd: '₹3,000-7,000', r: 4.5, hg: true, tg: ['hidden-gem','heritage','peace'], d: 'A forgotten kingdom on the Betwa River. Magnificent cenotaphs with almost no crowds.' },
  { n: 'Mumbai', s: 'mumbai', st: 'maharashtra', t: 'Urban', bs: 'Oct-Mar', bd: '₹8,000-25,000', r: 4.4, tg: ['urban','food','heritage'], d: 'City of Dreams. Gateway of India, Marine Drive, Bollywood, the best street food.' },
  { n: 'Darjeeling', s: 'darjeeling', st: 'west-bengal', t: 'Hill Station', bs: 'Mar-May, Oct-Dec', bd: '₹6,000-15,000', r: 4.6, tg: ['tea','himalayas','toy-train'], d: 'Queen of the Hills. Tea gardens, UNESCO Toy Train, sunrise over Kanchenjunga.' },
  { n: 'Kolkata', s: 'kolkata', st: 'west-bengal', t: 'Urban', bs: 'Oct-Mar', bd: '₹5,000-15,000', r: 4.5, tg: ['culture','food','heritage'], d: 'City of Joy. Colonial architecture, legendary street food, Durga Puja energy.' },
  { n: 'Gangtok', s: 'gangtok', st: 'sikkim', t: 'Hill Station', bs: 'Mar-Jun, Oct-Dec', bd: '₹6,000-15,000', r: 4.5, tg: ['himalayas','buddhism'], d: 'Modern hill city with Kanchenjunga views. Buddhist monasteries, alpine lakes.' },
  { n: 'Cherrapunji', s: 'cherrapunji', st: 'meghalaya', t: 'Nature', bs: 'Oct-May', bd: '₹5,000-12,000', r: 4.6, tg: ['waterfalls','living-root-bridges'], d: 'Land of living root bridges. Double-decker root bridge trek is a bucket-list experience.' },
  { n: 'Rann of Kutch', s: 'rann-of-kutch', st: 'gujarat', t: 'Desert', bs: 'Nov-Feb', bd: '₹6,000-15,000', r: 4.7, tr: true, tg: ['desert','festival','culture'], d: 'Vast white salt desert that transforms under the full moon. Rann Utsav is magical.' },
  { n: 'Havelock Island', s: 'havelock-island', st: 'andaman-and-nicobar', t: 'Beach', bs: 'Oct-May', bd: '₹12,000-30,000', r: 4.7, tr: true, tg: ['beaches','scuba','snorkeling'], d: 'Asia\'s best beach — Radhanagar Beach. Crystal waters, coral reefs, world-class scuba.' },
];

async function main() {
  await mongoose.connect(config.database.url);
  console.log('🌱 Seeding MusafirX (MongoDB)...\n');
  const db = mongoose.connection.db!;
  const collections = await db.listCollections().toArray();
  for (const col of collections) { await db.collection(col.name).deleteMany({}); }
  console.log('Cleaned existing data.\n');

  const demoPw = await bcrypt.hash('Demo@12345', 12);
  const adminPw = await bcrypt.hash('Admin@12345', 12);

  await User.create({ name: 'Rahul Sharma', email: 'demo@musafirx.com', password: demoPw, role: 'USER', emailVerified: true, bio: 'Travel photographer & storyteller. 25 Indian states explored.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', profile: { phone: '+91-9876543210', location: 'Mumbai', travelStyle: 'BACKPACKING', totalTrips: 23, totalDestinations: 87, badges: ['Mountain Explorer', 'Foodie', 'Heritage Hunter'] } });
  await User.create({ name: 'Admin MusafirX', email: 'admin@musafirx.com', password: adminPw, role: 'ADMIN', emailVerified: true });
  await User.create({ name: 'Priya Patel', email: 'priya@example.com', password: demoPw, role: 'USER', emailVerified: true, bio: 'Solo female traveler.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', profile: { location: 'Bangalore', travelStyle: 'SOLO', badges: ['Beach Lover', 'Foodie'] } });
  await User.create({ name: 'Amit Verma', email: 'amit@example.com', password: demoPw, role: 'USER', emailVerified: true, bio: 'Weekend warrior.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', profile: { location: 'Delhi', travelStyle: 'ADVENTURE', badges: ['Mountain Explorer', 'Road Tripper'] } });
  console.log('  ✓ 4 demo users created');

  const stateMap: Record<string, any> = {};
  for (const state of indianStates) { const created = await State.create(state); stateMap[state.slug] = created; }
  console.log(`  ✓ ${indianStates.length} states`);

  for (const d of destData) {
    const state = stateMap[d.st];
    if (!state) continue;
    await Destination.create({ name: d.n, slug: d.s, stateId: state._id, type: d.t, bestSeason: d.bs, budget: d.bd, rating: d.r, isTrending: d.tr || false, isHiddenGem: (d as any).hg || false, tags: d.tg, description: d.d, longDescription: `${d.d} This is one of India\'s most captivating travel destinations.`, imageUrl: `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 9999999)}?w=800`, images: [], latitude: 15 + Math.random() * 20, longitude: 72 + Math.random() * 20 });
  }
  console.log(`  ✓ ${destData.length} destinations`);
  console.log('\n✅ Seed complete!');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
