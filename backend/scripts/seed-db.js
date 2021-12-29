const mongoose = require("mongoose");
require('../models/User');
require('../models/Item');
require('../models/Comment');
const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

if (!process.env.MONGODB_URI) {
  console.error("Please set the MONGODB_URI env var")
  return
}
mongoose.connect(process.env.MONGODB_URI);

async function run() {

  for (let i = 0; i < 2000; i++) {
    const user = {
      email: `user-${i}@email.com`,
      username: `user${i}`,
      following: [],
      favorites: [],
      role: "user",
      hash: 'hash-123',
      salt: 'salt-123'
    }
    const dbUser = new User(user);
    await dbUser.save();

    const item = {
      slug: `item-name-${Math.round(Math.random() * 10000000)}`,
      seller: dbUser,
      title: `item name ${i}`,
      description: "description",
      image: "",
      tagList: [],
      comments: [],
      favoritesCount: 0,
    }

    const dbItem = new Item(item);
    await dbItem.save();

    const comment = {
      body: `comment ${i}`,
      seller: dbUser,
      item: dbItem,
    }

    const dbComment = new Comment(comment);
    await dbComment.save();

    dbItem.comments = [dbComment];
    await dbItem.save();
    console.log(`Seeded db with item ${item.title} and comment ${comment.body}`);
  }
}

run()
  .then(() => {
    console.log('Finished DB seed');
    process.exit(0);
  })
  .catch((err) => {
    console.log(`Error while seeding, ${err.message}`)
    process.exit(1);
  })
