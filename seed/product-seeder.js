var Product = require("../models/product");

var mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/shopping", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));
Product.remove(function (err, p) {
  if (err) {
    throw err;
  } else {
    console.log("No Of Documents deleted:" + p);
  }
});

// mongoose.connection.dropDatabase(); // Dropping the database before applying new changes
var products = [
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
    title: "Gothic Video Game",
    description: "Awesome Game!!!!",
    price: 10,
  }),
  new Product({
    imagePath:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Codbox.jpg/220px-Codbox.jpg",
    title: "Call of Duty Video Game",
    description: "Meh ... nah, it's okay I guess",
    price: 40,
  }),
  new Product({
    imagePath:
      "https://upload.wikimedia.org/wikipedia/en/8/8e/Need_for_Speed_Most_Wanted_Box_Art.jpg",
    title: "Need for Speed Vedio Game",
    description: "Awesome Game !!!",
    price: 100,
  }),
  new Product({
    imagePath:
      "https://upload.wikimedia.org/wikipedia/en/f/fb/Total_Overdose_Coverart.png",
    title: "Total Overdose Vedio Game",
    description: "Awesome Game !!!",
    price: 50,
  }),
  new Product({
    imagePath:
      "https://upload.wikimedia.org/wikipedia/en/8/86/Sands_of_time_cover.jpg",
    title: "Prince of Persia Vedio Game",
    description: "Awesome Game !!!",
    price: 150,
  }),
  new Product({
    imagePath:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEEtzBhs4pVbW8OVgNYr5dCyD8GsxkxEJa2PhPd-FlGf828b2v6U-V8LpfQiyBiCxj6wI&usqp=CAU",
    title: "Minecraft Video Game",
    description: "Awesome Game !!!",
    price: 40,
  }),
  new Product({
    imagePath:
      "https://store-images.s-microsoft.com/image/apps.2678.13510798884671596.04227bb2-4efd-4b7d-9781-e52626ebb47f.6187888f-814a-4442-bb7b-859746425162",
    title: "Gears of War Video Game",
    description: "Awesome Game !!!",
    price: 40,
  }),
  new Product({
    imagePath:
      "https://store-images.s-microsoft.com/image/apps.2678.13510798884671596.04227bb2-4efd-4b7d-9781-e52626ebb47f.6187888f-814a-4442-bb7b-859746425162",
    title: "Gears of War Video Game",
    description: "Awesome Game !!!",
    price: 40,
  }),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function (err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
