INF656_Assignment_3:

A continuation of my previous midterm project. Uses MongoDB instead of a local JSON data file. MongoDB automatically creates IDs for items.

1. Install the project by using the 'npm install' command in the terminal.

2. Create your own .env file with the mongodb://... URI and database name.

3. Use 'npm start' in a terminal to start the server.

4. API Endpoints:
· GET  /api/items/   This returns all the items as well as the total number of items.
· GET  /api/items/:id   This returns the item associated with the specified ID.
· POST  /api/items   This adds a new item with a new ID.
· PATCH/PUT  /api/items/:id   This updates existing fields with new information.
· DELETE  /api/items/:id   This deletes the specified item.

Note: Searching for an item that does not exist leads to a 404 Not Found error and an invalid MongoDB ID leads to a 400 Bad Request error.
