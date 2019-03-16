FROM node:8
# Set the working directory to /client
WORKDIR /javascript

# copy package.json into the container at /javascript
COPY package*.json /javascript/

# install dependencies
RUN npm install

# Copy the current directory contents into the container at /javascript
COPY . /javascript/

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]