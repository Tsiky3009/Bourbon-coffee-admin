// import client from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import NextAuth, { AuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { z } from "zod";
// import { compare } from "bcrypt";

// type User = {
//   id: ObjectId;
//   username: string;
//   password: string;
// };

// async function getUser(username: string): Promise<User | undefined> {
//   try {
//     // Get user from mongo
//     const user = await client.db().collection("users").findOne({ username });
//     if (user) {
//       return { id: user._id, username: user.username, password: user.password };
//     }
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }

// export const authOptions: AuthOptions = {
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Parse crendential
//         const parsedCredentials = z
//           .object({
//             username: z.string(),
//             password: z.string().min(6),
//           })
//           .safeParse(credentials);

//         // Get user
//         if (parsedCredentials.success) {
//           const { username, password } = parsedCredentials.data;
//           const user = await getUser(username);
//           if (!user) return null;
//           const passwordMatch = await compare(password, user.password);

//           if (passwordMatch) return user;
//         }

//         console.log("Invalid credentials");
//         return null;
//       },
//     }),
//   ],
// };

// export default NextAuth(authOptions);
