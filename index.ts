// In TicketoNowhere/index.ts
import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

new Elysia()
  .use(
    staticPlugin({
      assets: "public",
      prefix: "/",
    })
  )
  .get("/", () => Bun.file("public/index.html"))
  .listen(3000);

console.log("CORPUS.SYS server running at http://localhost:3000");
