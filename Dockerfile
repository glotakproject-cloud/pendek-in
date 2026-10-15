# ==============================================================================
# Dockerfile Multi-Stage Build untuk Pendek-In (Next.js 15 Standalone)
# ==============================================================================

# 1. Base Node.js Image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# 2. Stage Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 3. Stage Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variabel dummy untuk build time Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_URL=https://pendek.in
ENV NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy_anon_key

RUN npm run build

# 4. Stage Runner (Production)
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Salin hasil build
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
