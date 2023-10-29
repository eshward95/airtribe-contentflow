FROM node:18-alpine

WORKDIR /usr/src/app

# . represents the WORKDIR
COPY package*.json .

# we use ci to install same dependenies
RUN npm ci

# copy files to the WORKDIR
COPY . .

# EXPOSE 8080

CMD ["npm", "start"]