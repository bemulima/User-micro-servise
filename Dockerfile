# Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 2>/dev/null || true
RUN npm ci --no-audit --no-fund
COPY tsconfig*.json ./
COPY src ./src
COPY openapi ./openapi
RUN npm run build

# Run
FROM gcr.io/distroless/nodejs22
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/openapi ./openapi
EXPOSE 8080
USER 1001
CMD ["dist/main.js"]
