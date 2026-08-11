FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
# Chromium is required by Puppeteer. We skip Puppeteer's own download and use the Alpine package.
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
# Pin npm to the same version that generates package-lock.json locally (npm 11),
# otherwise `npm ci` fails on npm 10's different dependency-tree resolution.
RUN npm install -g npm@11.11.0 && npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Chromium is required by Puppeteer. The apk 'chromium' package pulls in its
# own library dependencies; the path resolution in scraper.service.ts falls
# back to /usr/bin/chromium regardless of any PUPPETEER_EXECUTABLE_PATH env.
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont dumb-init
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PORT=4000
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/fonts ./fonts
COPY --from=build /app/scripts ./scripts
RUN mkdir -p /app/logs
EXPOSE 4000
CMD ["dumb-init", "node", "dist/index.js"]
