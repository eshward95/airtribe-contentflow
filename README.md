# Contentflow
Content flow is is a lightweight Content Management System (CMS) designed for rapid endpoint creation.
With Content Flow, users can effortlessly create custom endpoints to manage and deliver content efficiently
The application is built with **Node.js** and **Express.js**, utilizing **Docker** for containerization, **Redis** for caching, and **Mongoose** for seamless interaction with the **MongoDB** database.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Docker](#docker-usage)
- [Usage](#usage)
  - [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
   - [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Indexing and Redis Cache](#indexing-and-redis-cache)


## Getting Started

### Prerequisites

Before you can run the application, ensure you have the following installed:

- Node.js and npm: [Download Node.js](https://nodejs.org/)
- Docker: [Download Docker](https://docs.docker.com/get-docker/)

### Installation
 Once you've installed these dependencies, follow the instructions below:

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/eshward95/airtribe-book-my-show.git
   ```

2. Install the necessary dependencies for both server and client:

   ```
   npm install
   ```

3. Start the server and client using:

   ```
   npm start
   ```

4. Open the application in your browser:
    >Server is running on   
     ```
   http://localhost:3001
   ```

### Docker Usage
To run the application as a Docker container, use the following commands:

1. Build the Docker image:

   ```
   docker compose build
   ```

2. Run the Docker container:

   ```
   docker compose up -d
   ```

The application will be accessible at `http://localhost:4000`.

## Usage

### API Documentation

The API documentation is provided using Postman documentation
[here](https://documenter.getpostman.com/view/6256239/2s9YRGy9f9#intro)

## Project Structure

- `app.js`: The main application file.
- `routes/`: Contains route definitions for job and user management.
- `controllers/`:  handling the incoming requests and controlling the flow of data between the model and the view.
- `services/`: business logic and performs specific tasks related to data manipulation or external integrations.
- `models/`: Defines the data models for jobs and users.
- `config/`: Stores configuration files.
- `middleware/`: Contains custom middleware for authentication and error handling.
- `utils/`: Utility functions.
- `Dockerfile`: Docker image configuration.
- `validations`: Handling various validations for data being passed through request.

### Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Multer
- Redis

## API Endpoints

**Endpoint:** */api/content-type*

- **Description**: Content types define the structure and attributes of content items. You can create, retrieve, update, and delete content types using this API.

- **HTTP Methods**:
  - `GET`: Retrieve a list of content types.
  - `POST`: Create a new content type.
  - `PUT /{id}`: Update an existing content type by ID.
  - `DELETE /{id}`: Delete a content type by ID.

**Endpoint:** */api/content-data*

- **Description**: Use this endpoint to interact with content data. Content data represents the actual content items, such as articles, blog posts, or products. You can create, retrieve, update, and delete content data items.

- **HTTP Methods**:
  - `GET`: Retrieve a list of content data items.
  - `GET /{content_type(name|slug)}/{id}`: Retrieve a specific content data item by ID.
  - `POST//{content_type(name|slug)}`: Create a new content data item.
  - `PUT /{content_type(name|slug)}/{id}`: Update an existing content data item by ID.
  - `DELETE /{content_type(name|slug)}/{id}`: Delete a content data item by ID.

**Endpoint:** */api/content-media*

- **Description**: This endpoint manages media content within the CMS. Media content may include images, videos, or other multimedia assets. You can upload, retrieve, update, and delete media content using this API.

- **HTTP Methods**:
  - `GET`: Retrieve a list of media content items.
  - `GET /{id}`: Retrieve a specific media content item by ID.
  - `POST`: Upload and create new media content.
  - `PUT /{id}`: Update an existing media content item by ID.
  - `DELETE /{id}`: Delete a media content item by ID.

## Database Structure
### Content Type Schema

- `name`: A unique identifier for the content type. This name distinguishes one content type from another.
- `slug`: This is generated whenever a new content type is created using *slugify*
- `description`: A field to provide a textual description of the content type.
- `relations`: An array of relationships that specify how this content type is related to other content types. These relationships can be one-to-one, one-to-many, or many-to-many.
- `fields`: An array of fields that define the attributes and properties of content items associated with this content type. Each field consists of a name and a data type.



### Content Data Schema

- `content_type_id`: A reference to the content type that defines the structure of the content.
- `relations`: An array of relationships with other content types, specifying the type of relationship.
- `attributes`: An array of attributes, each consisting of a name-value pair. This is where the content's data is stored.
- `media`: An array of references to media assets associated with the content.


### Media Schema

- `filePath`: A string representing the file path or location of the media asset.
- `s3Key`: A string used to identify the asset within cloud storage systems like Amazon S3.
- `fileName`: The name of the media file, typically including the file extension.
- `fileType`: A string indicating the type or format of the media (e.g., "image/jpeg" or "video/mp4").
- `size`: A number representing the size of the media file in bytes.

Certainly, here's a brief README on adding indexes for content type name and slug and implementing Redis caching for content types in your CMS:

---

# Indexing and Redis Cache

 To optimize the retrieval of content types based on their name and slug, indexes are created.

#### Indexes Added
1. *Name*: 
2. *Slug*: 
3. *content_type_id*


#### Redis Cache for Content Types

To further optimize content type retrieval, implemented Redis caching.
Caching is implemented only for **content types** due to the **low writes** and **higher reads**.




