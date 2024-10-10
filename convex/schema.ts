import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    isCompleted: v.boolean(),
    author: v.id("users"),
    comments: v.array(v.id("comments")),
  }),
  comments: defineTable({
    text: v.string(),
  }),
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }),
});
