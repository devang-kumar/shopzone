const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  { name: 'MacBook Pro 14"', description: 'Apple M3 chip, 16GB RAM, 512GB SSD. The most powerful MacBook ever.', price: 1999.99, originalPrice: 2199.99, category: 'Electronics', brand: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', countInStock: 15, isFeatured: true, rating: 4.8, numReviews: 124 },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling with 30-hour battery life.', price: 279.99, originalPrice: 349.99, category: 'Electronics', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', countInStock: 30, isFeatured: true, rating: 4.7, numReviews: 89 },
  { name: 'Nike Air Max 270', description: 'Lightweight and breathable running shoes with Max Air cushioning.', price: 129.99, originalPrice: 150.00, category: 'Sports', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', countInStock: 50, isFeatured: true, rating: 4.5, numReviews: 210 },
  { name: 'The Pragmatic Programmer', description: 'Your journey to mastery. A must-read for every developer.', price: 39.99, category: 'Books', brand: 'Addison-Wesley', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', countInStock: 100, rating: 4.9, numReviews: 456 },
  { name: 'Samsung 4K Smart TV 55"', description: 'Crystal UHD 4K display with Tizen OS and built-in streaming apps.', price: 649.99, originalPrice: 799.99, category: 'Electronics', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', countInStock: 20, isFeatured: true, rating: 4.6, numReviews: 78 },
  { name: 'Levi\'s 501 Original Jeans', description: 'The original straight fit jeans. Timeless style since 1873.', price: 59.99, originalPrice: 79.99, category: 'Clothing', brand: 'Levi\'s', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', countInStock: 75, rating: 4.4, numReviews: 320 },
  { name: 'Instant Pot Duo 7-in-1', description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, and more.', price: 89.99, originalPrice: 119.99, category: 'Home', brand: 'Instant Pot', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', countInStock: 40, isFeatured: true, rating: 4.7, numReviews: 1203 },
  { name: 'LEGO Star Wars Millennium Falcon', description: '7541 pieces. The most detailed LEGO Star Wars set ever created.', price: 849.99, category: 'Toys', brand: 'LEGO', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', countInStock: 10, rating: 4.9, numReviews: 567 },
  { name: 'iPad Air 5th Gen', description: 'M1 chip, 10.9-inch Liquid Retina display, 5G capable.', price: 749.99, originalPrice: 799.99, category: 'Electronics', brand: 'Apple', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', countInStock: 25, rating: 4.8, numReviews: 95 },
  { name: 'Adidas Ultraboost 22', description: 'Responsive running shoes with BOOST midsole technology.', price: 179.99, originalPrice: 200.00, category: 'Sports', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', countInStock: 45, rating: 4.6, numReviews: 178 },
  { name: 'Clean Code by Robert Martin', description: 'A handbook of agile software craftsmanship. Essential reading.', price: 34.99, category: 'Books', brand: 'Prentice Hall', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', countInStock: 80, rating: 4.8, numReviews: 892 },
  { name: 'Dyson V15 Detect Vacuum', description: 'Laser detects invisible dust. Most powerful cordless vacuum.', price: 699.99, originalPrice: 749.99, category: 'Home', brand: 'Dyson', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', countInStock: 18, isFeatured: true, rating: 4.7, numReviews: 234 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(products);

  // Create admin user
  const existing = await User.findOne({ email: 'admin@shopzone.com' });
  if (!existing) {
    await User.create({ name: 'Admin', email: 'admin@shopzone.com', password: 'admin123', isAdmin: true });
    console.log('Admin created: admin@shopzone.com / admin123');
  }

  console.log(`Seeded ${products.length} products`);
  process.exit();
}

seed().catch(console.error);
