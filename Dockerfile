# ---------- Build stage ----------
FROM oven/bun:1.2-alpine AS build
WORKDIR /app

COPY package.json bun.lock* bunfig.toml ./
RUN bun install --frozen-lockfile || bun install

COPY . .

# Build a plain Node server bundle into ./dist
ENV NITRO_PRESET=node-server
RUN bun run build

# ---------- Runtime stage ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server/index.mjs"]
