# Use the appropriate base image
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Use Nginx or directly serve with vite preview
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE 9875
CMD ["npm", "run", "preview"]
