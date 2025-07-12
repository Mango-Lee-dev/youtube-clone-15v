import { db } from "@/db";
import { categories } from "@/db/schema";

//  TODO: Create a script to seed the categories table with the following data:
const categoriesNames = [
  "Cards and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoriesNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);
    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
}

main();
