import { requireAdmin } from '../../utils/adminAuth'
import { connectDB } from '../../utils/db'

import { cacheDel } from '../../utils/redis'
import { Product } from '../../models/product'
import { slugify } from '../../utils/slugify'

const SOURCES = ['Shopee', 'Lazada', 'Amazon'] as const
const img = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`

const PRODUCTS = [
  // --- PHONES ---
  { title: 'iPhone 15 Pro Max 256GB Natural Titanium', description: 'Apple A17 Pro chip, 48MP main camera, titanium design, USB-C, Action Button.', price: 999, originalPrice: 1199, category: 'phones', source: 'Amazon', rating: 4.9, tags: ['apple', 'iphone', '5g'], imageUrl: img('iphone15pm'), compareGroupId: 'iphone-15-pro-max' },
  { title: 'iPhone 15 Pro Max 256GB Natural Titanium', description: 'Apple A17 Pro chip, 48MP main camera, titanium design, USB-C, Action Button.', price: 1049, originalPrice: 1199, category: 'phones', source: 'Lazada', rating: 4.8, tags: ['apple', 'iphone', '5g'], imageUrl: img('iphone15pm'), compareGroupId: 'iphone-15-pro-max' },
  { title: 'iPhone 14 128GB Midnight', description: 'A15 Bionic chip, Dual 12MP camera system, all-day battery life.', price: 699, originalPrice: 799, category: 'phones', source: 'Shopee', rating: 4.7, tags: ['apple', 'iphone'], imageUrl: img('iphone14') },
  { title: 'Samsung Galaxy S24 Ultra 256GB', description: 'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, 6.8" QHD+ display.', price: 1099, originalPrice: 1299, category: 'phones', source: 'Amazon', rating: 4.8, tags: ['samsung', '5g', 's-pen'], imageUrl: img('s24ultra'), compareGroupId: 'galaxy-s24-ultra' },
  { title: 'Samsung Galaxy S24 Ultra 256GB', description: 'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, 6.8" QHD+ display.', price: 1129, originalPrice: 1299, category: 'phones', source: 'Shopee', rating: 4.7, tags: ['samsung', '5g', 's-pen'], imageUrl: img('s24ultra'), compareGroupId: 'galaxy-s24-ultra' },
  { title: 'Samsung Galaxy S24+ 256GB', description: '50MP camera, Snapdragon 8 Gen 3, 4900mAh battery, 6.7" display.', price: 799, originalPrice: 999, category: 'phones', source: 'Lazada', rating: 4.6, tags: ['samsung', '5g'], imageUrl: img('s24plus') },
  { title: 'Xiaomi 14 Ultra 512GB', description: '1-inch Leica camera, Snapdragon 8 Gen 3, 90W fast charging.', price: 899, originalPrice: 999, category: 'phones', source: 'Shopee', rating: 4.7, tags: ['xiaomi', 'leica', '5g'], imageUrl: img('xiaomi14ultra') },
  { title: 'Redmi Note 13 Pro+ 256GB', description: '200MP camera, 120Hz AMOLED, 120W fast charge, IP68 rated.', price: 349, originalPrice: 429, category: 'phones', source: 'Shopee', rating: 4.5, tags: ['xiaomi', 'redmi', 'budget'], imageUrl: img('redminote13') },
  { title: 'Google Pixel 8 Pro 128GB', description: 'Tensor G3, 50MP camera with AI features, 7 years OS updates.', price: 799, originalPrice: 999, category: 'phones', source: 'Amazon', rating: 4.6, tags: ['google', 'pixel', 'android'], imageUrl: img('pixel8pro') },
  { title: 'OPPO Find X7 Ultra 512GB', description: 'Hasselblad quad camera, Snapdragon 8 Gen 3, 100W wireless charging.', price: 999, originalPrice: 1099, category: 'phones', source: 'Lazada', rating: 4.6, tags: ['oppo', 'hasselblad', '5g'], imageUrl: img('oppofindx7') },
  { title: 'OnePlus 12 256GB', description: 'Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC, 6.82" display.', price: 649, originalPrice: 799, category: 'phones', source: 'Amazon', rating: 4.5, tags: ['oneplus', '5g', 'fast-charge'], imageUrl: img('oneplus12') },
  { title: 'Nothing Phone 2 256GB', description: 'Unique Glyph Interface, Snapdragon 8+ Gen 1, clean Android experience.', price: 549, originalPrice: 649, category: 'phones', source: 'Shopee', rating: 4.4, tags: ['nothing', 'glyph', 'unique'], imageUrl: img('nothingphone2') },
  // --- LAPTOPS ---
  { title: 'Apple MacBook Pro 14" M3 Pro 18GB', description: 'M3 Pro chip, Liquid Retina XDR display, 22hr battery, MagSafe 3.', price: 1799, originalPrice: 1999, category: 'laptops', source: 'Amazon', rating: 4.9, tags: ['apple', 'macbook', 'm3'], imageUrl: img('macbookpro14'), compareGroupId: 'macbook-pro-14-m3' },
  { title: 'Apple MacBook Pro 14" M3 Pro 18GB', description: 'M3 Pro chip, Liquid Retina XDR display, 22hr battery, MagSafe 3.', price: 1849, originalPrice: 1999, category: 'laptops', source: 'Lazada', rating: 4.8, tags: ['apple', 'macbook', 'm3'], imageUrl: img('macbookpro14'), compareGroupId: 'macbook-pro-14-m3' },
  { title: 'Apple MacBook Air 13" M2 8GB 256GB', description: 'Fanless M2 chip, 18hr battery, 1080p webcam, MagSafe charging.', price: 1099, originalPrice: 1299, category: 'laptops', source: 'Amazon', rating: 4.8, tags: ['apple', 'macbook', 'm2', 'ultralight'], imageUrl: img('macbookairm2') },
  { title: 'Dell XPS 15 9530 Core i9 RTX 4060', description: '13th Gen Intel i9, RTX 4060, 15.6" OLED 3.5K display, 86Whr battery.', price: 1799, originalPrice: 2199, category: 'laptops', source: 'Amazon', rating: 4.6, tags: ['dell', 'xps', 'rtx', 'oled'], imageUrl: img('dellxps15') },
  { title: 'Lenovo ThinkPad X1 Carbon Gen 11', description: 'Intel i7-1365U, 16GB RAM, 14" 2.8K OLED, 57Whr battery, MIL-SPEC.', price: 1399, originalPrice: 1799, category: 'laptops', source: 'Lazada', rating: 4.7, tags: ['lenovo', 'thinkpad', 'business'], imageUrl: img('thinkpadx1') },
  { title: 'ASUS ROG Zephyrus G14 RTX 4060', description: 'Ryzen 9, RTX 4060, 14" QHD 165Hz, 76Whr, AniMe Matrix lid.', price: 1299, originalPrice: 1599, category: 'laptops', source: 'Shopee', rating: 4.6, tags: ['asus', 'rog', 'gaming', 'rtx'], imageUrl: img('rogzephyrus') },
  { title: 'HP Spectre x360 14" OLED', description: 'Intel i7 Evo, 16GB, 2TB, 2.8K OLED touch, 360° hinge, 17hr battery.', price: 1449, originalPrice: 1699, category: 'laptops', source: 'Amazon', rating: 4.5, tags: ['hp', 'spectre', 'oled', '2-in-1'], imageUrl: img('hpspectre') },
  { title: 'Acer Aspire 5 A515 Core i5 16GB', description: 'Intel i5-1335U, 16GB RAM, 512GB SSD, 15.6" FHD IPS, WiFi 6.', price: 549, originalPrice: 699, category: 'laptops', source: 'Shopee', rating: 4.3, tags: ['acer', 'budget', 'student'], imageUrl: img('aceraspirei5') },
  // --- ACCESSORIES ---
  { title: 'Apple AirPods Pro 2nd Gen (USB-C)', description: 'Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, MagSafe.', price: 229, originalPrice: 249, category: 'accessories', source: 'Amazon', rating: 4.8, tags: ['apple', 'airpods', 'anc', 'earbuds'], imageUrl: img('airpodspro2'), compareGroupId: 'airpods-pro-2' },
  { title: 'Apple AirPods Pro 2nd Gen (USB-C)', description: 'Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, MagSafe.', price: 239, originalPrice: 249, category: 'accessories', source: 'Shopee', rating: 4.7, tags: ['apple', 'airpods', 'anc'], imageUrl: img('airpodspro2'), compareGroupId: 'airpods-pro-2' },
  { title: 'Sony WH-1000XM5 Wireless Headphones', description: 'Industry-leading ANC, 30hr battery, multipoint connection, foldable design.', price: 279, originalPrice: 399, category: 'accessories', source: 'Amazon', rating: 4.9, tags: ['sony', 'anc', 'headphones', 'wireless'], imageUrl: img('sonywh1000xm5') },
  { title: 'Samsung Galaxy Buds2 Pro', description: '24-bit Hi-Fi audio, ANC, IPX7, 8hr battery + 21hr case.', price: 159, originalPrice: 229, category: 'accessories', source: 'Lazada', rating: 4.5, tags: ['samsung', 'earbuds', 'anc'], imageUrl: img('galaxybuds2pro') },
  { title: 'Anker 737 Charger 120W GaN', description: '3-port 120W GaN charger, charges MacBook + iPhone + iPad simultaneously.', price: 49, originalPrice: 79, category: 'accessories', source: 'Amazon', rating: 4.7, tags: ['anker', 'charger', 'gan', 'fast-charge'], imageUrl: img('anker737') },
  { title: 'Logitech MX Master 3S Mouse', description: '8K DPI, MagSpeed scroll, USB-C, works on glass, ultra-quiet clicks.', price: 89, originalPrice: 109, category: 'accessories', source: 'Amazon', rating: 4.8, tags: ['logitech', 'mouse', 'productivity'], imageUrl: img('mxmaster3s') },
  { title: 'Spigen Ultra Hybrid iPhone 15 Case', description: 'Military-grade protection, crystal-clear back, precise cutouts.', price: 14, originalPrice: 19, category: 'accessories', source: 'Shopee', rating: 4.6, tags: ['spigen', 'case', 'iphone'], imageUrl: img('spigencase') },
  { title: 'Baseus 10000mAh Power Bank 22.5W', description: 'Slim design, dual USB-A + USB-C, LED indicator, fits in pocket.', price: 25, originalPrice: 39, category: 'accessories', source: 'Shopee', rating: 4.4, tags: ['baseus', 'powerbank', 'portable'], imageUrl: img('baseuspowerbank') },
  { title: 'Twelve South HiRise Pro MacBook Stand', description: 'Adjustable aluminum stand, cable management, ergonomic height.', price: 79, originalPrice: 99, category: 'accessories', source: 'Amazon', rating: 4.5, tags: ['stand', 'macbook', 'ergonomic'], imageUrl: img('hirisepro') },
  // --- GAMING ---
  { title: 'Sony PlayStation 5 DualSense Controller', description: 'Haptic feedback, adaptive triggers, built-in mic, USB-C, 12hr battery.', price: 69, originalPrice: 79, category: 'gaming', source: 'Amazon', rating: 4.8, tags: ['sony', 'ps5', 'controller'], imageUrl: img('dualsense') },
  { title: 'HyperX Cloud Alpha Wireless Gaming Headset', description: '300hr battery, DTS Headphone:X, memory foam, multi-platform.', price: 129, originalPrice: 199, category: 'gaming', source: 'Amazon', rating: 4.7, tags: ['hyperx', 'gaming', 'headset', 'wireless'], imageUrl: img('hyperxalpha') },
  { title: 'Razer DeathAdder V3 HyperSpeed', description: '90hr battery, 26K DPI optical sensor, lightweight 64g, HyperSpeed wireless.', price: 89, originalPrice: 119, category: 'gaming', source: 'Lazada', rating: 4.7, tags: ['razer', 'mouse', 'gaming', 'wireless'], imageUrl: img('razerdeathadder') },
  { title: 'Logitech G Pro X Superlight 2', description: '63g ultralight, HERO 2 sensor, 95hr battery, 5 programmable buttons.', price: 129, originalPrice: 159, category: 'gaming', source: 'Amazon', rating: 4.8, tags: ['logitech', 'mouse', 'ultralight', 'pro'], imageUrl: img('gproxsl2') },
  { title: 'Nintendo Switch OLED Model', description: '7" OLED screen, 64GB storage, enhanced audio, wired LAN port in dock.', price: 349, originalPrice: 399, category: 'gaming', source: 'Amazon', rating: 4.8, tags: ['nintendo', 'switch', 'portable', 'oled'], imageUrl: img('switcholed') },
  { title: 'Xbox Wireless Controller Carbon Black', description: 'Textured grip, USB-C, Bluetooth 5.0, 40hr AA battery life.', price: 49, originalPrice: 59, category: 'gaming', source: 'Shopee', rating: 4.7, tags: ['xbox', 'controller', 'wireless'], imageUrl: img('xboxcontroller') },
  // --- FASHION ---
  { title: 'Nike Air Max 270 Men\'s Shoes', description: 'Max Air heel unit, breathable mesh upper, foam midsole for all-day comfort.', price: 109, originalPrice: 149, category: 'fashion', source: 'Lazada', rating: 4.6, tags: ['nike', 'airmax', 'sneakers', 'men'], imageUrl: img('nikeairmax270') },
  { title: 'Adidas Ultraboost 23 Running Shoes', description: 'Boost midsole, Primeknit upper, Continental rubber outsole, 12mm drop.', price: 139, originalPrice: 189, category: 'fashion', source: 'Shopee', rating: 4.5, tags: ['adidas', 'ultraboost', 'running'], imageUrl: img('ultraboost23') },
  { title: 'Levi\'s 512 Slim Taper Jeans', description: 'Slim through thigh, tapered leg, stretch denim, 5-pocket styling.', price: 59, originalPrice: 79, category: 'fashion', source: 'Amazon', rating: 4.4, tags: ['levis', 'jeans', 'slim', 'denim'], imageUrl: img('levis512') },
  { title: 'Ray-Ban Classic Aviator Sunglasses', description: 'Crystal green lenses, gold metal frame, 100% UV protection, Spring hinges.', price: 139, originalPrice: 179, category: 'fashion', source: 'Amazon', rating: 4.7, tags: ['rayban', 'sunglasses', 'aviator'], imageUrl: img('raybanaviator') },
  { title: 'Seiko 5 Sports Automatic Watch', description: '24-jewel automatic movement, day/date display, 100m water resistant, stainless.', price: 189, originalPrice: 249, category: 'fashion', source: 'Lazada', rating: 4.6, tags: ['seiko', 'watch', 'automatic', 'sports'], imageUrl: img('seiko5') },
  { title: 'Herschel Supply Co. Little America Backpack', description: '25L capacity, fleece-lined laptop sleeve, padded straps, signature stripe.', price: 79, originalPrice: 99, category: 'fashion', source: 'Amazon', rating: 4.5, tags: ['herschel', 'backpack', 'laptop'], imageUrl: img('herschelbackpack') },
  // --- HOME ---
  { title: 'Dyson V15 Detect Cordless Vacuum', description: 'Laser dust detection, HEPA filtration, LCD screen, 60min run time.', price: 649, originalPrice: 799, category: 'home', source: 'Amazon', rating: 4.8, tags: ['dyson', 'vacuum', 'cordless', 'hepa'], imageUrl: img('dysonv15') },
  { title: 'Xiaomi Mi Robot Vacuum S10+', description: 'LiDAR navigation, 4000Pa suction, auto-empty station, mop function.', price: 299, originalPrice: 449, category: 'home', source: 'Shopee', rating: 4.6, tags: ['xiaomi', 'robot-vacuum', 'smart-home'], imageUrl: img('xiaomivacuums10') },
  { title: 'Philips Hue Starter Kit (4 bulbs + Bridge)', description: 'Smart bulbs, 16M colors, voice control compatible, app scheduling.', price: 139, originalPrice: 199, category: 'home', source: 'Amazon', rating: 4.7, tags: ['philips', 'smart-light', 'hue', 'alexa'], imageUrl: img('philipshue') },
  { title: 'Breville Barista Express Espresso Machine', description: 'Built-in grinder, 15-bar pressure, steam wand, 67oz water tank.', price: 599, originalPrice: 749, category: 'home', source: 'Amazon', rating: 4.8, tags: ['breville', 'espresso', 'coffee', 'grinder'], imageUrl: img('brevillebarista') },
  { title: 'Instant Pot Duo 7-in-1 6Qt', description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker.', price: 79, originalPrice: 119, category: 'home', source: 'Amazon', rating: 4.7, tags: ['instantpot', 'pressure-cooker', 'kitchen'], imageUrl: img('instantpot') },
  { title: 'Ergotron LX Dual Monitor Arm', description: 'Holds 2x up to 34" monitors, VESA 75/100, cable management, height adj.', price: 149, originalPrice: 199, category: 'home', source: 'Amazon', rating: 4.7, tags: ['ergotron', 'monitor-arm', 'wfh', 'desk'], imageUrl: img('ergotronlx') },
  // --- BEAUTY ---
  { title: 'Dyson Supersonic Hair Dryer', description: 'Fast drying, intelligent heat control, 3 attachments, reduces frizz.', price: 399, originalPrice: 479, category: 'beauty', source: 'Amazon', rating: 4.8, tags: ['dyson', 'hair-dryer', 'premium'], imageUrl: img('dysonsupersonic') },
  { title: 'Oral-B iO Series 9 Electric Toothbrush', description: 'AI recognition, 7 brushing modes, magnetic charging, travel case.', price: 139, originalPrice: 219, category: 'beauty', source: 'Amazon', rating: 4.7, tags: ['oralb', 'toothbrush', 'electric', 'dental'], imageUrl: img('oralbiofull') },
  { title: 'COSRX Advanced Snail 96 Mucin Power Essence', description: '96% snail secretion filtrate, hydration, skin repair, brightening, all skin types.', price: 19, originalPrice: 25, category: 'beauty', source: 'Shopee', rating: 4.8, tags: ['cosrx', 'snail', 'skincare', 'essence', 'kbeauty'], imageUrl: img('cosrxsnail') },
  { title: 'La Roche-Posay Anthelios Sunscreen SPF50+', description: 'Ultra-light fluid, non-greasy, water-resistant, suitable for sensitive skin.', price: 29, originalPrice: 39, category: 'beauty', source: 'Lazada', rating: 4.7, tags: ['larocheposay', 'sunscreen', 'spf50', 'skincare'], imageUrl: img('larochespf50') },
  { title: 'The Ordinary Niacinamide 10% + Zinc 1%', description: 'Reduces blemishes and pores, regulates sebum, improves skin texture.', price: 9, originalPrice: 12, category: 'beauty', source: 'Shopee', rating: 4.6, tags: ['theordinary', 'niacinamide', 'skincare', 'budget'], imageUrl: img('ordinaryniacin') },
  // --- SPORTS ---
  { title: 'Garmin Forerunner 265 GPS Running Watch', description: 'AMOLED display, advanced running metrics, HRV status, 15-day battery.', price: 349, originalPrice: 449, category: 'sports', source: 'Amazon', rating: 4.8, tags: ['garmin', 'gps-watch', 'running', 'fitness'], imageUrl: img('garminforerunner265') },
  { title: 'Theragun Prime Percussive Therapy Device', description: '4 attachments, 5 speeds, 16mm amplitude, 150 min battery, QuietForce.', price: 199, originalPrice: 299, category: 'sports', source: 'Amazon', rating: 4.7, tags: ['theragun', 'massage', 'recovery', 'fitness'], imageUrl: img('theragunprime') },
  { title: 'Manduka PRO Yoga Mat 6mm', description: 'Lifetime guarantee, closed-cell surface, 71" x 24", 6mm cushion, non-slip.', price: 79, originalPrice: 120, category: 'sports', source: 'Amazon', rating: 4.8, tags: ['manduka', 'yoga', 'mat', 'premium'], imageUrl: img('mandukapro') },
  { title: 'Bowflex SelectTech 552 Adjustable Dumbbells', description: '5-52.5 lbs in 1, 15 weight settings, dial system, replaces 15 dumbbells.', price: 299, originalPrice: 429, category: 'sports', source: 'Amazon', rating: 4.7, tags: ['bowflex', 'dumbbell', 'adjustable', 'home-gym'], imageUrl: img('bowflex552') },
  { title: 'Hydro Flask 32oz Wide Mouth Water Bottle', description: 'TempShield insulation 24hr cold/12hr hot, BPA-free, powder coat, leakproof.', price: 39, originalPrice: 49, category: 'sports', source: 'Shopee', rating: 4.7, tags: ['hydroflask', 'bottle', 'insulated'], imageUrl: img('hydroflask32') },
]

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, message: 'Not found' })
  }
  await requireAdmin(event)
  const { drop } = getQuery(event)

  await connectDB()

  if (drop === 'true') await Product.deleteMany({})

  const existing = await Product.countDocuments()
  if (existing > 0 && drop !== 'true') {
    return { message: `Skipped — ${existing} products already exist. Pass ?drop=true to reseed.`, count: existing }
  }

  let created = 0
  for (const item of PRODUCTS) {
    const baseSlug = slugify(item.title)
    let slug = baseSlug
    let suffix = 1
    while (await Product.exists({ slug })) slug = `${baseSlug}-${suffix++}`

    await Product.create({ ...item, slug, affiliateUrl: `https://www.${ item.source === 'Amazon' ? 'amazon.com' : item.source === 'Shopee' ? 'shopee.ph' : 'lazada.com.ph' }` })
    created++
  }

  await cacheDel('recommendations:all', 'categories:all')
  return { message: 'Seeded successfully', created }
})
