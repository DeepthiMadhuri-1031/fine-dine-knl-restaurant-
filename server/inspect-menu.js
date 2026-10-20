import fs from 'fs';

const content = fs.readFileSync('src/data/menuData.ts', 'utf8');

// Simple parser for objects in MENU_ITEMS
const items = [];
const blocks = content.split(/\{\s*id:\s*['"]/);

for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const idMatch = block.match(/^([^'"]+)/);
  const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
  const catMatch = block.match(/category:\s*['"]([^'"]+)['"]/);
  const imgMatch = block.match(/imageUrl:\s*['"]([^'"]+)['"]/);

  if (idMatch && nameMatch && imgMatch) {
    items.push({
      id: idMatch[1],
      name: nameMatch[1],
      category: catMatch ? catMatch[1] : 'Unknown',
      imageUrl: imgMatch[1]
    });
  }
}

console.log(`Parsed ${items.length} items from menuData.ts`);

// Check the 23 items requested by user
const targets = [
  'Mushroom Biryani',
  'Palak Paneer',
  'Kurnool Special Paneer',
  'Paneer Tikka Masala',
  'Veg Mix Vegetable Curry',
  'Mix Veg',
  'Kaju Paneer Curry',
  'Veg Spring Rolls',
  'Paneer Spring Rolls',
  'Onion Pakoda',
  'Mushroom 65',
  'Baby Corn Manchurian',
  'Plain Naan',
  'Tandoori Roti',
  'Kurnool Special Fried Rice',
  'Veg Fried Rice',
  'Veg Noodles',
  'Special Curd Rice',
  'Curd Rice',
  'Mint Mojito',
  'Coca-Cola',
  'Blue',
  'Thick Cold Coffee',
  'Cold Coffee',
  'Fresh Watermelon Juice',
  'Watermelon',
  'Vanilla Ice Cream Milkshake',
  'Vanilla',
  'Chocolate Ice Cream Milkshake',
  'Chocolate'
];

console.log('\n--- TARGET SEARCH ---');
for (const t of targets) {
  const found = items.filter(it => it.name.toLowerCase().includes(t.toLowerCase()));
  if (found.length > 0) {
    found.forEach(f => console.log(`FOUND: [${f.id}] "${f.name}" (${f.category}) => ${f.imageUrl}`));
  }
}

console.log('\n--- ALL ITEMS IN MENUDATA.TS ---');
items.forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.id}] "${it.name}" (${it.category}) => ${it.imageUrl}`);
});

// Check for duplicated image URLs
const imgMap = {};
items.forEach(it => {
  imgMap[it.imageUrl] = (imgMap[it.imageUrl] || []).concat(it.name);
});
console.log('\n--- DUPLICATED IMAGES ---');
Object.entries(imgMap).forEach(([img, names]) => {
  if (names.length > 1) {
    console.log(`DUPLICATE (${names.length} items share ${img}):\n  ${names.join(', ')}`);
  }
});
