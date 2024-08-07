FROM node:16-alpine 

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh kode aplikasi dan .env file
COPY . .

# Expose port yang digunakan aplikasi
EXPOSE 5000

# Jalankan Prisma generate
RUN npx prisma generate

# Gunakan nodemon untuk menjalankan aplikasi
CMD ["npx", "nodemon", "index.js"]
