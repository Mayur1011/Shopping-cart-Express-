// // var express = require("express");
// // var router = express.Router();
// // var Cart = require("../models/cart");
// // var Product = require("../models/product");

// // /* GET home page. */
// // router.get("/", function (req, res, next) {
// //   Product.find(function (err, docs) {
// //     var productChunks = [];
// //     var chunkSize = 3;
// //     for (var i = 0; i < docs.length; i += chunkSize) {
// //       productChunks.push(docs.slice(i, i + chunkSize));
// //     }
// //     res.render("shop/index", {
// //       title: "Shopping Cart",
// //       products: productChunks,
// //     });
// //   });
// // });

// // router.get("/add-to-cart/:id", function (req, res, next) {
// //   var productId = req.params.id;
// //   console.log(req.session.cart);
// //   var cart = new Cart(req.session.cart ? req.session.cart.items : {});

// //   Product.findById(productId, function (err, product) {
// //     cart.add(product, product.id);
// //     req.session.cart = cart;
// //     // console.log(req.session.cart);
// //     res.redirect("/");
// //   });
// // });

// // router.get("/shopping-cart", function (req, res, next) {
// //   if (!req.session.cart) {
// //     console.log("Empty");
// //     return res.render("shop/shopping-cart", { products: null });
// //   }
// //   // console.log(req.session.cart.items);
// //   var cart = new Cart(req.session.cart.items);
// //   // console.log(cart);
// //   var products = cart.generateArray();
// //   console.log(products);
// //   res.render("shop/shopping-cart", {
// //     products: products,
// //     totalPrice: cart.totalPrice,
// //   });
// // });
// // module.exports = router;

// var express = require("express");
// var router = express.Router();
// var Product = require("../models/product");
// var Cart = require("../models/cart");

// router.use(function (req, res, next) {
//   res.locals.login = req.isAuthenticated();
//   next();
// });

// router.get("/", function (req, res, next) {
//   Product.find(function (err, docs) {
//     var productChunks = [];
//     var chunkSize = 3;
//     for (var i = 0; i < docs.length; i += chunkSize) {
//       productChunks.push(docs.slice(i, i + chunkSize));
//     }
//     res.render("shop/index", {
//       title: "Shopping Cart",
//       products: productChunks,
//     });
//   });
// });

// router.get("/add-to-cart/:id", function (req, res, next) {
//   var productId = req.params.id;
//   var cart = new Cart(req.session.cart ? req.session.cart.items : {});

//   Product.findById(productId, function (err, product) {
//     cart.add(product, product.id);
//     req.session.cart = cart;
//     res.redirect("/");
//   });
// });

// router.get("/shopping-cart", function (req, res, next) {
//   if (!req.session.cart) {
//     return res.render("shop/shopping-cart", { products: null });
//   }
//   var cart = new Cart(req.session.cart.items);
//   res.render("shop/shopping-cart", {
//     products: cart.generateArray(),
//     totalPrice: cart.totalPrice,
//   });
// });
// router.get("/checkout", function (req, res, next) {
//   if (!req.session.cart) {
//     return res.redirect("/shopping-cart");
//   }
//   var cart = new Cart(req.session.cart);
//   // var errMsg = req.flash("error")[0];
//   res.render("shop/checkout", {
//     total: cart.totalPrice,
//     // errMsg: errMsg,
//     // noError: !errMsg,
//   });
// });
// module.exports = router;

//---------------------------------------------------------------------------------------------------

var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");

var Product = require("../models/product");
var Order = require("../models/order");

/* GET home page. */
router.get("/", function (req, res, next) {
  var successMsg = req.flash("success")[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render("shop/index", {
      title: "Shopping Cart",
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg,
    });
  });
});

router.get("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/");
  });
});

router.get("/reduce/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/shopping-cart", function (req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get("/checkout", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/checkout", {
    total: cart.totalPrice,
  });
});

router.post("/checkout", isLoggedIn, function (req, res, next) {
  var cart = new Cart(req.session.cart);
  // req.flash("success", "Successfully bought the product!!!");
  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name,
  });
  order.save(function (err, result) {
    req.session.cart = null;
    res.render("shop/demo");
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}
