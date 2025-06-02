import { neon } from "@neondatabase/serverless";
import 'dotenv/config';


//Create SQL Connection
export const sql = neon(process.env.DATABASE_URL);