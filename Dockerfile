FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG API_CONFIGURADOR_URL
ARG API_VENTAS_URL
ARG API_DIGITALIZADO_URL
ARG COOKIE_DOMAIN
RUN npm run build

FROM node:16-alpine AS prod-deps
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
COPY package-lock.json .
RUN npm prune --production

FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

USER nextjs

CMD ["npm", "start"]
