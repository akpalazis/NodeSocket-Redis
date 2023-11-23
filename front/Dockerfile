# Use an official Node.js runtime as a parent image
FROM node:20.8.0

# Set the working directory inside the container
WORKDIR /app


COPY package.json ./package.json
# Install Node.js dependencies
RUN npm install
COPY . .

# Expose the port that the React development server will run on (usually 3000)
EXPOSE 3000

# Command to run the React development server
CMD ["npm", "run", "dev"]