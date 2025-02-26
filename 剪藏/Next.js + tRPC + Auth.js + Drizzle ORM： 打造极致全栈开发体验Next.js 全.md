## 前言

最近在使用 `next.js` 开发项目，发现开发起来还不错，所以在这里总结出来一个项目启动模版给大家分享一下，所使用到的技术栈有 `next.js`、`trpc`、`auth.js`、`tailwind`、`drizzle ORM` 等，覆盖了目前前端的主流技术。

在使用过程当中，我感觉使用这一套技术栈进行 web 开发，真的能够大大的提高我们整体的开发效率，像登录、注册、包括第三方的登录注册的这种，只需要几行代码就能成功实现。

并且在我的开发过程中发现，使用这一套技术栈完全能够胜任小型应用的后端开发。

接下来，我将通过整篇文章带大家上手使用这一套技术栈进行开发。

## 介绍

在实际动手开发之前，我先对整个技术栈做一个简单的介绍。

### `Next.js`

官网地址：[nextjs.org/](https://link.juejin.cn/?target=https%3A%2F%2Fnextjs.org%2F "https://nextjs.org/")

Next.js 是基于 React 的全栈框架，支持多种渲染策略（SSR/SSG/ISR）和现代 Web 开发需求，简单来说就是有部分代码在 `node.js` 的服务器里运行，有部分代码是在浏览器里运行的。

### `tRPC`

官网地址：[trpc.io/](https://link.juejin.cn/?target=https%3A%2F%2Ftrpc.io%2F "https://trpc.io/")

tRPC 是一个基于 TypeScript 的远程过程调用框架，能够简化客户端和服务端之间的通信，在实际开发过程当中的体验就是不需要再去定义各种 HTTP 接口的路由地址，而是直接采用函数调用的形式，并且因为它是基于 TypeScript 的原因，有非常强大的类型提示，开发起来非常方便。

### `TanStack Query`

官网地址：[tanstack.com/query](https://link.juejin.cn/?target=https%3A%2F%2Ftanstack.com%2Fquery "https://tanstack.com/query")

就是之前的 React Query，使用这个能够帮助开发者优雅的管理数据，开发者不用再重复的去写一堆处理前端请求过程当中的状态、报错等等问题，并且能够缓存数据，减少不必要的接口调用。

### `Auth.js`

官网地址：[authjs.dev/](https://link.juejin.cn/?target=https%3A%2F%2Fauthjs.dev%2F "https://authjs.dev/")

auth.js 是 next-auth 的 v5 版本，使用它能够非常方便的在我们的 next.js 项目当中集成用户认证、授权等等功能。

### `drizzle ORM`

官网地址：[orm.drizzle.team/](https://link.juejin.cn/?target=https%3A%2F%2Form.drizzle.team%2F "https://orm.drizzle.team/")

一个 node.js 的 ORM 框架，能够让开发者使用面向对象的方式来操作数据库当中的数据，并且它使用起来非常直观方便，如果你会写 SQL 的话，使用它会非常得心应手。

## 实战

下面的步骤展示的是具体的文件创建步骤，如果你直接需要源码的话，可以直接使用访问这个 GitHub 仓库来获取源码。

```
https://github.com/DimplesY/next-full-stack-demo
```

### 创建项目

使用下面的命令创建项目，设置项按图中所示即可。

```
pnpx create-next-app@latest next-full-stack
```

![1739721522406-M1DVq3](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4fde900fe3bc491fa94f5138ced6e9a5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=VnlOs8c9PM2EmRQYoEbgk8iPhys%3D)

### 集成 tRPC

然后我再安装一下 `tRPC` + `TanStack Query` 整合的相关依赖，直接复制下面的命令到项目的目录下安装即可。

```
pnpm add @trpc/server@next @trpc/client@next @trpc/react-query@next @trpc/next@next @tanstack/react-query@latest server-only
```

![1740185600379-CKvgjx](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2626f74def194349bd17019989ab2079~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=Jjvxqb5JaRYf%2B0Lb0MNSLjSU3ck%3D)

为了能够更好地处理 tRPC 的类型校验和数据转换，我们还需要使用到 `superjson` 和 `zod` 这两个依赖，使用下面的命令安装即可。

```
pnpm add zod superjson
```

![1740185858166-m4td8I](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cf5de2947c5449f0ac04cc4ff089e06e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=Q7G9ZZ8g72T5%2Br%2BKIZNP8pn7s%2Bo%3D)

使用你喜欢的开发工具打开项目，按照下面的三个步骤创建文件。

1. 然后在 `app` 目录里创建 `api/trpc/[trpc]` 目录，然后在 `[trpc]` 当中创建 `route.ts` 文件。
2. 在项目的根目录下创建 `server` 目录，这部分作为我们服务器端的代码，然后在其中的 `api` 目录下创建 `root.ts` 和 `trpc.ts` 文件。
3. 在项目的根目录下创建 `trpc` 目录，并且在其中创建 `query-client.ts`、`react.tsx`、`server.ts` 三个文件。

整个创建之后的文件目录结构如下图所示：

![1740186743835-vioty1](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5ac646d1f14a496f985c8c5c680009ad~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=FzHsxwYLBxrrLumeX50MsByQW74%3D)

### 集成 drizzle ORM

文件创建完毕之后，我们再来集成数据库 ORM 框架 -> `drizzle ORM` 。

我们先安装一下 `drizzle ORM` 需要的依赖, 这里我使用 `PostgreSQL` 作为数据库来存储数据 ，直接执行下面的命令进行安装即可。

```
pnpm add postgres drizzle-orm
```

![1740187297407-J9XmRp](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/224ebce817b34e849678f0bea8f90784~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=TIFwBaYNVLERZwyK%2BThQ3mbuNMo%3D)

为了方便进行数据库迁移操作，还需要使用到 `drizzle ORM` 提供的 `drizzle-kit` 包。

```
pnpm add drizzle-kit -D
```

![1740187730959-vhgSCZ](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4ed3eed6eb224bd7b7a9dbbadb354fe3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=BEidLVFUPoHhNEkBDHoii6HnmgU%3D)

在项目根目录下的 server 文件夹当中创建如图所示的 `db/index.ts` 文件和 `db/schema.ts` 文件。

为了能够让 `drizzle ORM` 能够链接到我们的数据库，我们还需要创建一个环境变量以及 `drizzle.config.ts` 配置文件。

```
# .env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/fullstack"
```

```
import { type Config } from "drizzle-kit";

export default {
  schema: "./server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  tablesFilter: ["fullstack_*"],
} satisfies Config;
```

为了更好的 `typescript` 体验，我们创建一个全局的 `process.env.DATABASE_URL` 类型。

在项目根目录下创建 `types/global.d.ts` 文件。

```
declare namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string;
  }
}
```

### 集成 `Auth.js`

上面的数据库 ORM 我们已经成功的集成进来了，接下来我们来安装授权相关的东西，直接使用 `auth.js` (`next-auth` 的下一个版本) , 使用下面的命令进行安装。

```
pnpm add next-auth@beta @auth/drizzle-adapter
```

再在 .env 文件当中添加一个 `next-auth` 需要的密钥

```
AUTH_SECRET="xxx"
```

然后创建如下图所示的文件：

![1740188475134-NiLlib](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/29e241ce60c349e5842bd36a91591bee~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=gPJ7nhjElbY2X7k7NpTn3EzwJBQ%3D)

到这里我们已经将项目所需的文件都创建完毕了，接下来我把每个文件所需要的代码都贴到下面，并且将一些比较难以理解的地方做一些简单的介绍。

### 源码部分

定义 `trpc` 的服务器接口地址，并且将所有请求转换成 trpc 的函数调用。

```
// app/api/trpc/[trpc]/route.ts

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };


```

创建 `trpc` 的服务端程序，并且定一个 `test` 的子路由，其中包括了一个 `foo` 函数将用户的调用返回。

```
// server/api/root.ts

import { createCallerFactory, createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from 'zod'

export const appRouter = createTRPCRouter({
  test: createTRPCRouter({
    foo:publicProcedure.input(z.object({ test: z.string() })).query(({ input }) => {
      return {
        input
      }
    })
  })
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

```

创建 `tRPC` 的上下对象，并且集成 `next-auth` ，如果用户登录成功，那么 `tRPC` 的上下文当中就会包含用的回话信息。

定义了一个 `publicProcedure` 用于无需登录验证的 `trpc` 路由定义，`protectedProcedure` 用于需要登录验证码的 `trpc` 路由定义。

```
// server/api/trpc.ts

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});


export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
  
```

定义了一个 `tRPC` 客户端，当我们在客户端组件当中调用 `tRPC` 路由函数时，需要使用到该函数创建客户端。

```
// trpc/query-client.ts

import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });

```

使用上面的 `createQueryClient` 创建出来一个全局的客户端，并且提供一个上下文对象供后代组件使用。

```
// trpc/react.tsx

"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "@/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();


export type RouterInputs = inferRouterInputs<AppRouter>;


export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
```

定义了一个服务端 `tRPC` 调用者，方便我们在 RSC (React Server Component / React 服务端组件) 之间相互调用。

```
// trpc/server.ts
import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createQueryClient } from "./query-client";

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
```

定义 `next-auth` 的配置文件，可以在当中添加自己应用的登录授权逻辑。

```
// server/auth/config.ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}


export const authConfig = {
  providers: [],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;

```

创建 `next-auth` 的处理程序，供 API 处理接口使用。

```
// server/auth/index.ts

import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
```

使用 `next-auth` 创建出来的路由器来处理授权相关的请求。

```
// app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/server/auth";

export const { GET, POST } = handlers;
```

创建全局的数据库连接。

```
// server/db/index.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
```

定义 `drizzle-orm` 与 `next-auth` 集成所需要数据库表文件。

```
// server/db/schema.ts

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `fullstack_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

```

有了上面的文件，接下来我们将数据表同步到我们的数据库当中去，注意将 `.env` 文件当中的 `DATABASE_URL` 改成你自己的数据库连接配置。

使用下面的命令，同步表到数据库当中。

```
pnpm drizzle-kit push
```

如下所示，即可将我们定义的 `schema` 同步到数据当中。

![1740191369976-XVmyP6](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/affbef1091df48c1a96214411c8a3bd6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=sUBa7IUYjDiC%2BvPCr2e6rky7ois%3D)

数据库当中，同步创建出来 4 张表，如下图所示：

![1740191468555-965Bh9](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d145837de58040f99402ebe946be9636~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=WDR%2FfYZjCo4U8ZXe27EOuSqnzhw%3D)

### 测试 tRPC 接口调用

修改 `RootLayout` 将我们的应用包在 `TRPCReactProvider` 当中。

![1740192288275-e4cRiN](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0659a65438674e88af92b98faf7a6114~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=I%2B8LZL7Inx%2FmPI%2F9es%2Blxc1m4zU%3D)

#### 服务端组件调用

修改 `app` 目录下的 `page.tsx` 添加下面的内容，注意导入的是 `@/trpc/server` 当中的 `api`.

![1740192353012-TEEDSz](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/20e55017a1dc489ebff2ed8b85af3aae~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=eFgteNruOeOmnZ4sDq%2BlSg4s7wI%3D)

访问页面，可以看到我们已经能够的使用服务端组件调用了我们的 `tTRPC` 接口，并且渲染出来了内容。

![1740192374084-8HNuvg](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c3f8f132941047a9853d27b27e59c0ae~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=qpaaYc4CO%2BSMBbp8oNO6%2Fc%2BVvDk%3D)

#### 客户端组件调用

创建客户端组件，如下图所示，注意是使用 `@/trpc/react` 当中的 `api` 。

![1740192548412-roPo3u](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f47bd6b30671459c92ec801849bfe3a0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=g1pKeB0VermDvzPE36JNiIsyEYM%3D)

修改 `page.tsx` 将客户端组件导入到其中，如下图所示:

![1740192538322-aTZrmf](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c0800741adae412ab0ba5f49b714a413~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=wNenzwk%2BTCNw8Iz4R4LWz5w2vDQ%3D)

访问页面，可以看到应该的将数据展示到了页面上，非常完美。

![1740192641446-zxLgYt](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0fb110967edd41d1813eed00e4e02765~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=oOduYNPfQr7LBkAcHuAGvDg%2FtXI%3D)

  ### 测试 GitHub 登录

测试过了上面的接口调用, 接下来我们给我们的应用接入 `Github` 登录的功能，需要提前在 github 上申请好 `Client ID` 和 `Client secrets` , 如下图所示：

![1740192832760-jcrGae](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5473ca206dff466bbfa0ab6c7fd37e53~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=KlrmO1mGuhzBJIU6OkuFz8TaJII%3D)

将 `Client ID` 和 `Client secrets` 分别设置到 `.env` 文件的 `AUTH_GITHUB_ID` 和 `AUTH_GITHUB_SECRET` 当中。

```
AUTH_GITHUB_ID="xxx"
AUTH_GITHUB_SECRET="xxx"
```

还需要将下面的 `Authorization callback URL` 设置成 `http://localhost:3000/api/auth/callback/github` 。

![1740193854798-d9t9jN](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f05aef79bda44d0cab833d5da2cd532c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=ztPBG%2Bns%2F%2BSLl96HmdaQNlg5XZ0%3D)

将 `GitHub` 填入 `server/auth/config.ts` 的 `Providers` 当中，如下图所示：

![1740193315809-MSc0V6](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e9597d38ec5f41d18637a91323381b55~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=aptpQTiHm5dAzTc9d2s%2FatKvADw%3D)

![1740193823925-w4ht10](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9017c9816b264552bb3bbe4700aba780~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=%2Fb2Vdw5x7tZRf4G6KqiXkQh7vkM%3D)

然后运行项目，访问 `http://localhost:3000/api/auth/signin`, 可以看到如下的界面，点击按钮跳转到 `Github` 授权界面 。

![1740193710416-XFT6IL](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d29cd7da0a7b480799a8ce4a46e1ad71~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=Lj9FmMLnBgCSDCaZ019K4pWy9hM%3D)

授权完成之后，可以看到，我们已经成功登录了，页面上显示出来我们的 `Github` 账号信息，如下图所示：

![1740194083207-LxSPzG](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/685a7d4e5abc4928be4ff2aeebfe078b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=R6sn56vVdEKbAl4nOI6h0lFEOD4%3D)

并且数据当中也成功的创建了用户的 Github 账户信息。 ![1740194835301-iTC07J](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/191e96b339ac4f0faa9755d729af6d56~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bel56iL5biIX1lhbg==:q75.awebp?rk3s=f64ab15b&x-expires=1740806492&x-signature=4NelVp%2B7kM6khgypR4yf8onSfk8%3D)

恭喜你！通过这篇教程的学习，你已经成功创建了一套全栈开发的基础模板，掌握了从前端到后端的核心技能。现在，无论是构建用户界面、处理业务逻辑，还是管理数据库，你都能游刃有余地应对。可以说已经迈出了成为全栈工程师的重要一步！