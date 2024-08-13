"use server";
import prisma from "@/lib/db";
import SearchHandler from "@/lib/filterhelper";
import { v2 as cloudinary } from "cloudinary";
import { customAlphabet } from "nanoid";

const alphabet = "0123456789";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

interface BookUpload {
  userId: string;
  cover: string;
  bookId: string;
  quantity: number;
  rent: number;
}

interface Asset {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
}

type Book = {
  bookName: string;
  author: string;
  category: string;
};

export default async function getOwners() {
  try {
    const users = await prisma.user.findMany({
      include: {
        books: true,
      },
    });

    if (users) return { users: users, message: "sccuess" };
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
}

export async function actionAddBook(userId: string, bookData: Book) {
  const customId = customAlphabet(alphabet, 6);
  try {
    const newBook = await prisma.book.create({
      data: {
        bookNo: customId(),
        status: "DISABLE",
        ...bookData,
        User: { connect: { id: userId } },
      },
    });

    if (newBook) {
      return newBook;
    }
  } catch (error) {
    console.error("Error adding book:", error);
  }
}

export async function actiongetBooks(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        books: {
          where: {
            status: "ACTIVE",
          },
        },
      },
    });

    if (user) return { books: user.books, message: "sccuess" };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("images") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: Asset = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          if (result) {
            const assetResult: Asset = {
              asset_id: result.asset_id,
              public_id: result.public_id,
              version: result.version,
              version_id: result.version_id,
              signature: result.signature,
              width: result.width,
              height: result.height,
              format: result.format,
              resource_type: result.resource_type,
              created_at: result.created_at,
              tags: result.tags || [],
              bytes: result.bytes,
              type: result.type,
              etag: result.etag,
              placeholder: result.placeholder,
              url: result.url,
              secure_url: result.secure_url,
              asset_folder: result.asset_folder || "",
              display_name: result.display_name || "",
              original_filename: result.original_filename || "",
              api_key: result.api_key || "",
            };
            return resolve(assetResult);
            // return resolve(result);
          }
        })
        .end(buffer);
    });

    if (!result)
      return { status: 500, msg: "Error Uploading Image", data: null };
    return {
      status: 201,
      msg: "Successfuly Uploaded Image",
      data: {
        url: result.secure_url,
        display_name: result.display_name,
      },
    };
  } catch (error) {}
}

type User = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  location: string;
  phoneNumber: string;
};

export async function signUpUser(user: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    // If the user already exists, return null or handle it as you see fit
    if (existingUser) return { message: "User Aleready Exist" };

    const newUser = await prisma.user.create({
      data: {
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        location: user.location,
      },
    });

    if (newUser) {
      return { message: "User Created", status: 200 };
    }
    return { message: "Error", status: 400 };

    return;
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error; // or return a custom error object/message
  }
}

export async function actionUploadBook({
  userId,
  cover,
  bookId,
  quantity,
  rent,
}: BookUpload) {
  try {
    const uploadBook = await prisma.uploadedBook.create({
      data: {
        cover: cover,
        quantity: quantity,
        rent: rent,
        User: { connect: { id: userId } },
        book: { connect: { id: bookId } },
      },
    });

    if (!uploadBook) {
      return {
        status: 500,
        msg: "error",
      };
    }

    return {
      status: 201,
      msg: "sccuess",
    };
  } catch (error) {}
}

export async function actionUpdateUserStatus(userId: string, status: string) {
  try {
    const updatedUser = await prisma.user.update({
      data: {
        status: status,
      },
      where: {
        id: userId,
      },
    });

    if (updatedUser) {
      return { user: updatedUser, message: "sccuess", status: 201 };
    }
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionUpdateBook(
  bookId: string,
  data: { status: string; rent: number; quantity: number }
) {
  try {
    const updatedUser = await prisma.uploadedBook.update({
      data: {
        ...data,
      },
      where: {
        id: bookId,
      },
    });

    if (updatedUser) {
      return { user: updatedUser, message: "sccuess", status: 201 };
    }
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionGetOwnerBooks(userId: string) {
  try {
    const users = await prisma.uploadedBook.findMany({
      where: { userId: userId },
      include: {
        User: {},
      },
    });

    /// exclue password and other info
    if (users) return { users: users, message: "sccuess", status: 200 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionGetAllOwners(params: any) {
  const { whereConditions, orderByClause } = SearchHandler(params);
  try {
    const owners = await prisma.user.findMany({
      skip: parseInt(params.start),
      take: parseInt(params.size),

      where: {
        role: "Owner",
        AND: whereConditions,
      },

      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        location: true,
        phoneNumber: true,
        status: true,
        avatar: true,
        approved: true,
        uploadedbooks: true,
      },

      orderBy: orderByClause || { createdAt: "asc" },
    });

    const uploadedd = owners.map((owner) => owner.uploadedbooks);

    const totalOwners = await prisma.user.count({ where: { role: "Owner" } });

    if (owners) return { data: owners, meta: { totalRowCount: totalOwners } };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionGetAllBooks(params: any) {
  const { whereConditions, orderByClause } = SearchHandler(params);
  try {
    const books = await prisma.uploadedBook.findMany({
      skip: parseInt(params.start),
      take: parseInt(params.size),
      where: {
        AND: whereConditions,
      },

      orderBy: orderByClause || { createdAt: "asc" },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            location: true,
          },
        },

        book: {
          select: {
            bookName: true,
            category: true,
            author: true,
            bookNo: true,
          },
        },
      },
    });

    const totalBooks = await prisma.book.count();

    if (books) return { data: books, meta: { totalRowCount: totalBooks } };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionApproveOwner(userId: string) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        approved: "APPROVED",
      },
    });

    if (!user) return null;

    return { message: "sccuess", status: 201 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionApproveListedBook(userId: string) {
  try {
    const user = await prisma.uploadedBook.update({
      where: {
        id: userId,
      },
      data: {
        approved: "APPROVED",
      },
    });

    if (!user) return null;

    return { message: "sccuess", status: 201 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionApproveBook(userId: string) {
  try {
    const user = await prisma.book.update({
      where: {
        id: userId,
      },
      data: {
        approved: "APPROVED",
      },
    });

    if (!user) return null;

    return { message: "sccuess", status: 201 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionDisableOwner(userId: string, status: string) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: status,
      },
    });

    if (!user) return null;

    return { message: "sccuess", status: 201 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionDisableBook(userId: string, status: string) {
  try {
    const user = await prisma.book.update({
      where: {
        id: userId,
      },
      data: {
        status: status,
      },
    });

    if (!user) return null;

    return { message: "sccuess", status: 201 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionGetAllUploadedBook(params: any) {
  const { whereConditions, orderByClause } = SearchHandler(params);
  try {
    const books = await prisma.book.findMany({
      skip: parseInt(params.start),
      take: parseInt(params.size),
      where: {
        AND: whereConditions,
      },

      orderBy: orderByClause || { createdAt: "asc" },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            location: true,
            phoneNumber: true,
          },
        },
      },
    });
    const totalBooks = await prisma.book.count();

    if (books) return { data: books, meta: { totalRowCount: totalBooks } };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionCheckStatus(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return { message: "Email Not Found", status: 401 };

    if (user?.approved === "APPROVE") {
      return { message: "User Not APPROVED", status: 401 };
    }
    if (user?.status === "DISABLE") {
      return { message: "User is Disabled", status: 401 };
    }

    return { message: "sccuess", role: user.role, status: 200 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionDeleteOwnerBook(id: string) {
  try {
    const book = await prisma.uploadedBook.delete({
      where: {
        id: id,
      },
    });

    if (!book) {
      return { message: "error", status: 500 };
    }
    return { message: "sccuess", status: 201 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

export async function actionUpdateBookStatus(id: string, status: string) {
  try {
    const book = await prisma.book.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    if (!book) {
      return { message: "error", status: 500 };
    }
    return { message: "sccuess", status: 201 };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}

const countOwnerCategories = (categories: any) => {
  const categoryCount = {
    SELFHELP: 0,
    FICTION: 0,
    BUSINESS: 0,
  };

  categories.forEach((category: any) => {
    if (category.category === "Fiction") categoryCount.FICTION += 1;
    if (category.category === "Self Help") categoryCount.SELFHELP += 1;
    if (category.category === "Business") categoryCount.BUSINESS += 1;
  });

  return categoryCount;
};

const countAllCategories = (categories: any) => {
  const categoryCount = {
    SELFHELP: 0,
    FICTION: 0,
    BUSINESS: 0,
  };

  categories.forEach((category: any) => {
    if (category.book.category === "Fiction") categoryCount.FICTION += 1;
    if (category.book.category === "Self Help") categoryCount.SELFHELP += 1;
    if (category.book.category === "Business") categoryCount.BUSINESS += 1;
  });

  return categoryCount;
};

export async function actionGetOwnerBookData(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        books: true,
      },
    });

    if (user) {
      const bookCategoryCounts = countOwnerCategories(user.books);

      return bookCategoryCounts;
    }
  } catch (error) {
    console.error("Error adding book:", error);
  }
}

export async function actionGetAllOwnerBookData() {
  try {
    const allbooks = await prisma.uploadedBook.findMany({
      include: {
        book: true,
      },
    });

    if (allbooks) {
      const bookCategoryCounts = countAllCategories(allbooks);

      return bookCategoryCounts;
    }
  } catch (error) {
    console.error("Error adding book:", error);
  }
}

// export async function actionGetAllOwnerBookData() {
//   try {
//     const users = await prisma.user.findMany({
//       include: {
//         books: true,
//       },
//     });
//   } catch (error) {
//     console.error("Error adding book:", error);
//   }
// }

export async function actionGetUploadedBook(params: any) {
  const { whereConditions, orderByClause } = SearchHandler(params);

  try {
    const books = await prisma.uploadedBook.findMany({
      skip: parseInt(params.start),
      take: parseInt(params.size),
      where: {
        userId: params.id,
        AND: whereConditions,
      },

      orderBy: orderByClause || { createdAt: "asc" },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },

        book: {
          select: {
            id: true,
            bookNo: true,
            bookName: true,
          },
        },
      },
    });
    const totalBooks = await prisma.book.count();

    if (books) return { data: books, meta: { totalRowCount: totalBooks } };
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
}
