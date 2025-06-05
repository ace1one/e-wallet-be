import  express  from 'express';
import { sql } from "../config/db.js"; 
const router = express.Router();


const now = new Date().toISOString();

const categories = [
  { id: 1, name: 'Food & Drinks', icon: 'fast-food', description: 'Food related spending' },
  { id: 2, name: 'Health & Fitness', icon: 'heart', description: 'Health and fitness related' },
  { id: 3, name: 'Bills & Utils', icon: 'receipt', description: 'Utility and bill payments' },
  { id: 4, name: 'Shopping', icon: 'cart', description: 'Shopping expenses' },
  { id: 5, name: 'Transportation', icon: 'car', description: 'Travel and transport costs' },
  { id: 6, name: 'Entertainment', icon: 'game-controller', description: 'Fun and entertainment' },
  { id: 7, name: 'Travel', icon: 'airplane', description: 'Trips and vacations' },
  { id: 8, name: 'Education', icon: 'school', description: 'Learning and schooling' },
  { id: 9, name: 'Income', icon: 'cash', description: 'Income sources' },
  { id: 10, name: 'Investment', icon: 'trending-up', description: 'Stocks, crypto, etc.' },
  { id: 11, name: 'Rent', icon: 'home-outline', description: 'Monthly housing rent' },
  { id: 12, name: 'Other', icon: 'help-circle', description: 'Miscellaneous' },
];

router.post('/seed-categories', async (req, res) => {
  try {
    const values = categories.flatMap((cat) => [
      cat.id,
      cat.name,
      cat.icon,
      cat.description,
      'ACTIVE',
      now
    ]);

    const placeholders = categories
      .map((_, i) => {
        const offset = i * 6;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
      })
      .join(', ');

    const query = `
      INSERT INTO category (id, name, icon, description, status, created_at)
      VALUES ${placeholders}
      ON CONFLICT (id) DO NOTHING;
    `;

    await sql.query(query, values);

    res.status(201).json({ message: 'Categories seeded successfully' });
  } catch (error) {
    console.error('Error seeding categories:', error);
    res.status(500).json({ error: 'Seeding failed' });
  }
});

export default router
