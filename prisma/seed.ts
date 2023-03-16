import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getToys().map(async (toy) => {
      await db.toy.create({ data: toy });
    })
  );

  await Promise.all(
    getImages().map(async (image) => {
      await db.image.create({ data: image });
    })
  );
}

seed();

function getToys() {
  // Right now we are going to fill this seed file with only one Toy and one Image.
  // However, you are able to add more data if you want.
  const toys: any[] = [
    {
      id: 1,
      name: "Baby Yoda",
      price: Math.floor(Math.random() * 700),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Dady Yoda",
      price: Math.floor(Math.random() * 900),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Mommy Yoda",
      price: Math.floor(Math.random() * 800),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return toys;
}

function getImages() {
  const images: any[] = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1611250535839-94b88cf88bba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736&q=80",
      toyId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1586136194012-35ceaddbd773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      toyId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1412&q=80",
      toyId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      toyId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return images;
}

// Open the package.json and add the following script:

// package.json
// "prisma": {
//     "seed": "ts-node prisma/seed.tsx"
//  },
