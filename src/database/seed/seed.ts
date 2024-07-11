import { PrismaClient } from "@prisma/client";
import { IBook } from "../../interface/book";
import { IUser } from "../../interface/user";
import { PasswordUtil } from "../../utils/password";

const prisma = new PrismaClient();

async function main() {
  const user: IUser = {
    username: "rifkiari",
    password: await PasswordUtil.hash("ari123"),
  };

  await prisma.user.create({
    data: user,
  });

  const categories = [
    {
      name: "Adventure",
    },
    {
      name: "Drama",
    },
  ];

  await prisma.category.createMany({
    data: categories,
  });

  const books: IBook[] = [
    {
      code: "B001",
      title: "Harry Potter",
      author: "J.K Rowling",
      stock: 10,
      category_id: 1,
    },
    {
      code: "B002",
      title: "The Lord of the Rings",
      author: "JRR Tolkien",
      stock: 15,
      category_id: 1,
    },
    {
      code: "B003",
      title: "The Women",
      author: "Kristin Hannah",
      stock: 20,
      category_id: 2,
    },
  ];

  await prisma.book.createMany({
    data: books,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
