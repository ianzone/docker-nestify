FROM ianzone/pnpm:latest AS base

WORKDIR /app

# populate local registry cache
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# ###################
# # BUILD FOR PRODUCTION
# ###################
FROM base AS build

COPY . ./

RUN npm pkg delete scripts.prepare

# https://pnpm.io/zh/cli/install#--frozen-lockfile
RUN pnpm install --frozen-lockfile --offline

RUN pnpm build

# remove devDependencies
RUN pnpm install --frozen-lockfile --offline --prod

# ###################
# # PRODUCTION
# ###################
FROM node:18-alpine As production

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD node dist/api.js