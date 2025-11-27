//Testing if env file works
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.NEXT_PUBLIC_DATABASE_URL);