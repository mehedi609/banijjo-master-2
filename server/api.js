const express = require("express");
const fetch = require("node-fetch");
const { sampleSize } = require("lodash");
const { dbConnection, query } = require("./db_local_config");
// const { dbConnection, query } = require("./db_com_bd_config");

dbConnection.connect(err => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await query("SELECT * FROM category");
    return res.send({ error: false, data: categories, message: "users list." });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

router.get("/feature_name", async (req, res) => {
  const feature_name = await query("SELECT * FROM feature_name");

  return res.send(feature_name);
});

router.get("/all_product_list", async function(req, res) {
  const resultArray = {};
  const feature_names = await query("SELECT * FROM feature_name");
  const categoryName = await query("SELECT * FROM category");
  const bannerImagesCustom = await query(
    "SELECT * FROM banner WHERE softDel = 0"
  );

  for (const feature_name of feature_names) {
    if (feature_name.code === 2) {
      resultArray.HotDeals = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.HotDealsTitle = feature_name.name;
    } else if (feature_name.code === 3) {
      resultArray.TopSelections = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.TopSelectionsTitle = feature_name.name;
    } else if (feature_name.code === 4) {
      resultArray.NewForYou = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.NewForYouTitle = feature_name.name;
    } else if (feature_name.code === 0) {
      resultArray.BannerTop = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.BannerTopTitle = feature_name.name;
    } else if (feature_name.code === 6) {
      resultArray.StoreWIllLove = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.StoreWIllLoveTitle = feature_name.name;
    } else if (feature_name.code === 7) {
      resultArray.More = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.MoreTitle = feature_name.name;
    } else if (feature_name.code === 1) {
      resultArray.BannerImages = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.BannerImagesTitle = feature_name.name;
    } else if (feature_name.code === 5) {
      resultArray.FeaturedBrands = await query(
        "SELECT feature_id, feature_products FROM feature_products where feature_id=" +
          feature_name.id
      );
      resultArray.FeaturedBrandsTitle = feature_name.name;
    }
  }

  resultArray.categories = categoryName;
  resultArray.bannerImagesCustom = bannerImagesCustom;
  return res.send({
    error: false,
    data: resultArray,
    message: "all Product list."
  });
});

router.get("/getDiscountByProductId/:product_id", async (req, res) => {
  try {
    let discountAmount = 0;
    const { product_id } = req.params;
    const discountArr = await query(
      `select product_id from discount where softDel=0 and status='active' and curdate() between effective_from and effective_to`
    );

    for (const item of discountArr) {
      const itemArr = JSON.parse(item["product_id"]);
      itemArr.forEach(({ id, discount }) => {
        if (id === product_id) discountAmount += parseInt(discount);
      });
    }

    res.json({ discountAmount });
  } catch (e) {
    console.error(e.message);
    res.send("Server Error");
  }
});

router.get("/productDetails/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const data = await query(
      `SELECT * FROM products WHERE id=${productId} AND softDelete=0 AND isApprove='authorize' AND status='active'`
    );

    const productDetails = { ...data[0] };

    const {
      id,
      product_specification_name,
      image,
      metaTags,
      vendor_id,
      category_id,
      product_full_description
    } = productDetails;

    const product_specification = JSON.parse(product_specification_name);

    // colors array
    if (product_specification.hasOwnProperty("color")) {
      const { color } = product_specification;
      productDetails.colors = await Promise.all(
        color.map(async item => {
          const data = await query(
            `SELECT id, name FROM color_infos WHERE id=${item.colorId} AND softDel=0 AND status=1`
          );
          return { ...item, colorName: data[0].name };
        })
      );
    } else {
      productDetails.colors = null;
    }

    // size array
    if (product_specification.hasOwnProperty("size")) {
      const { size } = product_specification;
      productDetails.sizes = await Promise.all(
        size.map(async id => {
          const data = await query(
            `SELECT id, size, size_type_id FROM size_infos WHERE id=${id} AND softDel=0 AND status=1`
          );
          return { ...data[0] };
        })
      );
    } else {
      productDetails.sizes = null;
    }

    // Carousel Images
    const imageArr = JSON.parse(image);
    productDetails.carouselImages = imageArr.length ? imageArr : null;

    //metaTags
    productDetails.metaTags = !!metaTags ? JSON.parse(metaTags) : null;

    // product_full_description
    const product_description = JSON.parse(product_full_description);
    productDetails.description = product_description.length
      ? product_description
      : null;

    // product List of Similar Vendor-Other Category
    productDetails.productSmVendor = await query(
      `SELECT id, product_name, product_sku, home_image, productPrice FROM products 
      WHERE vendor_id=${vendor_id} AND category_id <> ${category_id} AND 
      id <> ${id} AND softDelete=0 AND isApprove='authorize' AND status='active' ORDER BY RAND() LIMIT 6`
    );

    // product List of Similar Vendor-Other Category
    productDetails.productSmCategory = await query(
      `SELECT id, product_name, product_sku, home_image, productPrice FROM products 
       WHERE category_id=${category_id} AND vendor_id <> ${vendor_id} AND 
       id <> ${id} AND softDelete=0 AND isApprove='authorize' AND status='active' ORDER BY RAND() LIMIT 6`
    );

    delete productDetails.product_specification_id;
    delete productDetails.product_specification_details;
    delete productDetails.product_specification_details_description;
    delete productDetails.product_full_description;
    delete productDetails.product_specification_name;
    delete productDetails.image;

    return res.json(productDetails);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

var lastChildsAll = [];

router.get("/sidebar_category", async (req, res) => {
  try {
    const categories = await query(
      `Select * FROM category_order WHERE status=1`
    );

    return res.send({
      error: false,
      data: categories,
      message: "all category list."
    });
  } catch (e) {
    console.error(e);
  }
});

router.get("/child_categories", async (req, res) => {
  try {
    let c_id = req.query.id;

    let category_ids = [c_id];
    let categoryArray = [];

    let categoryObj = {};
    var lastChildsObjects = [];

    const subCategoriesList = await query(
      `SELECT * FROM category where parent_category_id=${c_id}`
    );

    for (const j in subCategoriesList) {
      let lastObj = {};
      category_ids = [...category_ids, subCategoriesList[j].id];

      // var childArray = findoutChildsOfSub(subCategoriesList[j].id,allCategories);
      var childArray = await query(
        "SELECT * FROM category where parent_category_id=" +
          subCategoriesList[j].id +
          ""
      );

      for (const k in childArray)
        category_ids = [...category_ids, childArray[k].id];

      lastObj.category = subCategoriesList[j];
      lastObj.lastChilds = childArray;
      lastChildsObjects.push(lastObj);
    }

    let vendor_ids = [];

    for (const c_id in category_ids) {
      const v_ids = await query(
        `select distinct vendor_id from products where category_id = ${category_ids[c_id]}`
      );

      vendor_ids = [...vendor_ids, ...v_ids];
    }

    const distinct_vendor_ids = [...new Set(vendor_ids.map(x => x.vendor_id))];
    let vendor_images = [];

    for (const id of distinct_vendor_ids) {
      const v_image = await query(
        `select vendor_id, logo from vendor_details where vendor_id=${id}`
      );

      vendor_images = [...vendor_images, ...v_image];
    }

    categoryObj.subcategories = lastChildsObjects;
    categoryObj.vendorImages = vendor_images;
    categoryArray.push(categoryObj);

    return res.send({
      error: false,
      data: categoryArray,
      message: "all category list."
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

router.get("/all_category_list", async (req, res) => {
  var categories = await query(
    "SELECT category.id,category.category_name,category_order.status from category_order LEFT JOIN category ON category_order.category_id = category.id"
  );

  var categoryArray = [];
  let vendor_images = [];
  if (categories.length > 0) {
    lastChildsAll.length = 0;
    for (const i in categories) {
      let category_ids = [];
      category_ids = [...category_ids, categories[i].id];
      let categoryObj = {};
      var lastChildsObjects = [];
      const subCategoriesList = await query(
        "SELECT * FROM category where parent_category_id=" +
          categories[i].id +
          ""
      );

      for (const j in subCategoriesList) {
        let lastObj = {};
        category_ids = [...category_ids, subCategoriesList[j].id];

        // var childArray = findoutChildsOfSub(subCategoriesList[j].id,allCategories);
        var childArray = await query(
          "SELECT * FROM category where parent_category_id=" +
            subCategoriesList[j].id +
            ""
        );

        for (const k in childArray)
          category_ids = [...category_ids, childArray[k].id];

        lastObj.category = subCategoriesList[j];
        lastObj.lastChilds = childArray;
        lastChildsObjects.push(lastObj);
      }
      let vendor_ids = [];

      for (const c_id in category_ids) {
        const v_ids = await query(
          `select distinct vendor_id from products where category_id = ${category_ids[c_id]}`
        );
        vendor_ids = [...vendor_ids, ...v_ids];
      }

      const distinct_vendor_ids = [
        ...new Set(vendor_ids.map(x => x.vendor_id))
      ];

      let vendor_images = [];

      for (const id of distinct_vendor_ids) {
        const v_image = await query(
          `select vendor_id, logo from vendor_details where vendor_id=${id}`
        );
        vendor_images = [...vendor_images, ...v_image];
      }

      categoryObj.category = categories[i];
      categoryObj.subcategories = lastChildsObjects;
      categoryObj.vendorImages = vendor_images;
      categoryArray.push(categoryObj);
    }
  }
  return res.send({
    error: false,
    data: categoryArray,
    message: "all category list."
  });
});

router.get("/all_category_list_more", async (req, res) => {
  var categories = await query(
    "SELECT * FROM category where parent_category_id=0"
  );

  var categoryArray = [];
  if (categories.length > 0) {
    lastChildsAll.length = 0;
    for (const i in categories) {
      let categoryObj = {};
      var lastChildsObjects = [];
      const subCategoriesList = await query(
        "SELECT * FROM category where parent_category_id=" +
          categories[i].id +
          ""
      );
      for (const j in subCategoriesList) {
        let lastObj = {};

        // var childArray = findoutChildsOfSub(subCategoriesList[j].id,allCategories);
        var childArray = await query(
          "SELECT * FROM category where parent_category_id=" +
            subCategoriesList[j].id +
            ""
        );
        lastObj.category = subCategoriesList[j];
        lastObj.lastChilds = childArray;
        lastChildsObjects.push(lastObj);
      }
      categoryObj.category = categories[i];
      categoryObj.subcategories = lastChildsObjects;
      categoryArray.push(categoryObj);
    }
  }

  return res.send({
    error: false,
    data: categoryArray,
    message: "all category list."
  });
});

// new api
router.post("/checkInventory", async (req, res) => {
  try {
    const cartData = req.body.cartProducts;
    for (const i in cartData) {
      const purchaseDetialsQuantity = await query(
        "SELECT sum(inv_purchase_details.quantity) as quantity FROM inv_purchase_details WHERE productId = '" +
          cartData[i].id +
          "'"
      );
      const purchaseReturnQuantity = await query(
        "SELECT sum(inv_purchase_return_details.quantity) as quantity FROM inv_purchase_return_details WHERE productId = '" +
          cartData[i].id +
          "'"
      );
      const salesDetailsQuantity = await query(
        "SELECT sum(sales_details.sales_product_quantity) as quantity FROM sales_details WHERE product_id = '" +
          cartData[i].id +
          "'"
      );
      const salesReturnQuantity = await query(
        "SELECT sum(sales_return_details.salesReturnQuantity) as quantity FROM sales_return_details WHERE productId = '" +
          cartData[i].id +
          "'"
      );
      const itemInventory =
        purchaseDetialsQuantity[0].quantity -
        purchaseReturnQuantity[0].quantity -
        salesDetailsQuantity[0].quantity +
        salesReturnQuantity[0].quantity;

      if (itemInventory > 0) {
        if (itemInventory < cartData[i].quantity) {
          return res.status(200).send({
            error: false,
            data: false,
            message: "Item not in Inventory!"
          });
        }
      } else {
        return res.status(200).send({
          error: false,
          data: false,
          message: "Item not in Inventory!"
        });
      }
    }
    return res.status(200).send({ error: false, data: true, message: "Ok!" });
  } catch (error) {
    return res
      .status(404)
      .send({ error: true, data: false, message: error.message });
  }
});

// new api
router.get("/getVendorImages", async (req, res) => {
  const vendorImages = await query(
    "SELECT vendor_id,logo from vendor_details WHERE softDel=0 AND status=1"
  );
  return res.send({ error: false, data: vendorImages, message: "Ok!" });
});

// Get request to fetch top navbar category
router.get("/getTopNavbarCategory", async (req, res) => {
  const categories = await query(
    "SELECT * from category_top_navbar WHERE status=1"
  );
  return res.send({ error: false, data: categories, message: "Ok!" });
});

// edited by sojib vai
router.post("/payOrder", async (req, res) => {
  try {
    const tempSells = await query(
      "select temp_sell.customer_id,temp_sell.item_ids,temp_sell.quantity,products.productPrice from temp_sell left join products on temp_sell.item_ids=products.id where customer_id='" +
        req.body.customerId +
        "'"
    );
    var totalQuantity = 0;
    var totalPrice = 0;
    var discountAmount = req.body.discountAmount;
    const discountDetail = req.body.discountDetail;
    var promoCodeAmount = req.body.promoCodeAmount;
    const promoCodeDetail = req.body.promoCodeDetail;

    for (const i in tempSells) {
      totalQuantity = totalQuantity + tempSells[i].quantity;
      totalPrice =
        totalPrice + tempSells[i].productPrice * tempSells[i].quantity;
    }

    var finalPrice = totalPrice - discountAmount - promoCodeAmount;
    var date = new Date();
    var year = date.getFullYear();
    var todayDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    String.prototype.lpad = function(padString, length) {
      var str = this;
      while (str.length < length) str = padString + str;
      return str;
    };

    const saleRecord = await query(
      "SELECT sales_bill_no FROM sales where createdDate BETWEEN CONCAT(YEAR(CURDATE()),'-01-01') AND CONCAT(YEAR(CURDATE())+1,'-12-31') order by id desc LIMIT 1"
    );
    if (saleRecord.length > 0) {
      var saleRecordBillNo = saleRecord[0].sales_bill_no;
      var splitBillNo = saleRecordBillNo.split("-");
      var billPaddingInt = parseInt(splitBillNo[2]) + 1;
      var newBillPadding = billPaddingInt.toString().lpad("0", 7);
      var newBillNo = "BNJ-" + year + "-" + newBillPadding;
    } else {
      var newBillPadding = "1".lpad("0", 7);
      var newBillNo = "BNJ-" + year + "-" + newBillPadding;
    }

    const insertSell = await query(
      "insert into sales(sales_bill_no,sales_type,customer_id,sales_date,total_sales_quantity,total_sales_amount,discount_amount,promo_code,netAmount) VALUES('" +
        newBillNo +
        "','cash','" +
        req.body.customerId +
        "','" +
        todayDate +
        "','" +
        totalQuantity +
        "','" +
        totalPrice +
        "','" +
        discountAmount +
        "','" +
        JSON.stringify(promoCodeDetail) +
        "','" +
        finalPrice +
        "')"
    );
    const salesId = insertSell.insertId;
    const insertPayment = await query(
      "insert into product_payment(customer_id,order_id,payment_amount,payment_method) VALUES('" +
        req.body.customerId +
        "','" +
        salesId +
        "','" +
        finalPrice +
        "','cash')"
    );

    for (const i in tempSells) {
      let totalAmount = tempSells[i].quantity * tempSells[i].productPrice;

      var discountAmount = 0;
      for (j in discountDetail) {
        if (tempSells[i].item_ids == discountDetail[j].productId) {
          discountAmount =
            discountAmount + discountDetail[j].amount * tempSells[i].quantity;
        }
      }

      var customerPayableAmount = totalAmount - discountAmount;

      const purchaseDetialsQuantity = await query(
        "SELECT sum(inv_purchase_details.quantity) as quantity FROM inv_purchase_details WHERE productId = '" +
          tempSells[i].item_ids +
          "'"
      );
      const purchaseReturnQuantity = await query(
        "SELECT sum(inv_purchase_return_details.quantity) as quantity FROM inv_purchase_return_details WHERE productId = '" +
          tempSells[i].item_ids +
          "'"
      );
      const salesDetailsQuantity = await query(
        "SELECT sum(sales_details.sales_product_quantity) as quantity FROM sales_details WHERE product_id = '" +
          tempSells[i].item_ids +
          "'"
      );

      const salesReturnQuantity = await query(
        "SELECT sum(sales_return_details.salesReturnQuantity) as quantity FROM sales_return_details WHERE productId = '" +
          tempSells[i].item_ids +
          "'"
      );
      const itemInventory =
        purchaseDetialsQuantity[0].quantity -
        purchaseReturnQuantity[0].quantity -
        salesDetailsQuantity[0].quantity +
        salesReturnQuantity[0].quantity;

      if (itemInventory > 0) {
        if (itemInventory > tempSells[i].quantity) {
          await query(
            "insert into sales_details(customer_id,sales_bill_no,product_id,sales_product_quantity,unitPrice,total_amount,customer_payable_amount,discounts_amount) VALUES('" +
              req.body.customerId +
              "','" +
              newBillNo +
              "','" +
              tempSells[i].item_ids +
              "','" +
              tempSells[i].quantity +
              "','" +
              tempSells[i].productPrice +
              "','" +
              totalAmount +
              "','" +
              customerPayableAmount +
              "','" +
              discountAmount +
              "')"
          );
          await query(
            "delete from temp_sell where customer_id='" +
              req.body.customerId +
              "' and item_ids='" +
              tempSells[i].item_ids +
              "'"
          );
        } else {
          throw Error("Item Not in Inventory");
        }
      } else {
        throw Error("Item Not in Inventory");
      }
    }

    return res.status(200).send({
      error: false,
      data: true,
      message: "Nice! Your Order Has been placed Successfully"
    });
  } catch (error) {
    return res
      .status(404)
      .send({ error: true, data: false, message: error.message });
  }
});

// new api
router.post("/getDiscounts", async (req, res) => {
  const discounts = await query(
    "SELECT * FROM discount WHERE effective_from <= NOW() AND effective_to >= NOW() AND softDel=0 AND status='active'"
  );
  const cartProducts = req.body.cartProducts;

  const cartIds = [];
  const cartProductQty = [];
  if (req.body.customerId) {
    for (let i in cartProducts) {
      cartIds.push(parseInt(cartProducts[i].id));
      cartProductQty.push({
        productId: cartProducts[i].id,
        quantity: cartProducts[i].quantity
      });
    }
  } else {
    for (let i in cartProducts) {
      cartIds.push(parseInt(cartProducts[i].productId));
      cartProductQty.push({
        productId: cartProducts[i].productId,
        quantity: cartProducts[i].quantity
      });
    }
  }

  var discountAmount = 0;
  const discountDetail = [];
  for (let i in discounts) {
    const parsedArr = JSON.parse(discounts[i].product_id);

    for (let j in parsedArr) {
      var specific = parseInt(parsedArr[j].id);
      if (cartIds.includes(specific) === true) {
        for (const k in cartProductQty) {
          if (cartProductQty[k].productId == specific) {
            discountAmount =
              discountAmount +
              parseInt(parsedArr[j].discount) * cartProductQty[k].quantity;
          }
        }
        discountDetail.push({
          id: discounts[i].id,
          productId: specific,
          amount: parseInt(parsedArr[j].discount)
        });
      }
    }
  }

  return res.send({
    error: false,
    data: discountAmount,
    dataDetail: discountDetail,
    message: "Yes"
  });
});

// new api
router.post("/getPromoCodeAmount", async (req, res) => {
  let promoCodeInput = req.body.promoCodeInput;
  let totalAmount = req.body.totalAmount;
  let customerId = req.body.customerId;

  const promo = await query(
    "SELECT * FROM promocode WHERE promo_code='" +
      promoCodeInput +
      "' AND effective_from <= NOW() AND effective_to >= NOW() AND softDel=0 AND status=1"
  );
  const customerSalesData = await query(
    "select promo_code from sales where customer_id='" + customerId + "'"
  );

  let consumedPromoAmount = 0;
  let usedTimes = 0;
  if (customerSalesData.length > 0) {
    for (let i in customerSalesData) {
      const promoCodeArr = JSON.parse(customerSalesData[i].promo_code);
      for (let j in promoCodeArr) {
        if (promoCodeInput === promoCodeArr[j].code) {
          consumedPromoAmount =
            consumedPromoAmount + parseInt(promoCodeArr[j].amount);
          usedTimes++;
        }
      }
    }
  }

  const promoDetail = [];
  let promoCodeAmount = 0;
  for (let i in promo) {
    let invoice_amount = promo[i].invoice_amount;
    let promo_amount = promo[i].promo_amount;
    let promo_percantage = promo[i].promo_percantage;
    let isMultiple = promo[i].isMultiple;
    let valueAfterPercentageCalculation =
      (promo_percantage / 100) * totalAmount;

    if (valueAfterPercentageCalculation > promo_amount) {
      var routerlicableAmount = promo_amount;
    } else {
      var routerlicableAmount = valueAfterPercentageCalculation;
    }

    if (consumedPromoAmount < invoice_amount) {
      if (consumedPromoAmount > 0) {
        if (isMultiple === "yes") {
          if (promo[i].times > usedTimes) {
            promoCodeAmount = promoCodeAmount + routerlicableAmount;
          } else {
            promoCodeAmount = promoCodeAmount;
          }
        } else {
          promoCodeAmount = promoCodeAmount;
        }
      } else {
        promoCodeAmount = promoCodeAmount + routerlicableAmount;
      }
    }
  }
  promoDetail.push({ code: promoCodeInput, amount: promoCodeAmount });
  return res.send({
    error: false,
    data: promoCodeAmount,
    dataDetail: promoDetail,
    message: "Yes"
  });
});

// new api
router.post("/paySsl", async (req, res) => {
  fetch("http://ecomservice.banijjo.com.bd/ssl", {
    method: "POST",
    crossDomain: true,
    headers: {
      Accept: "routerlication/json",
      "Content-Type": "routerlication/json"
    },
    body: JSON.stringify({
      customerId: req.body.customerId,
      discountAmount: req.body.discountAmount,
      discountDetail: req.body.discountDetail,
      promoCodeAmount: req.body.promoCodeAmount,
      promoCodeDetail: req.body.promoCodeDetail
    })
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      return res.send({ error: false, data: data, message: "Api Successfull" });
    })
    .catch(err => {
      console.log(err);
    });
});

// revised api
router.post("/loginCustomerInitial", async (req, res) => {
  const loginCustomer = await query(
    "select * from customer where email='" +
      req.body.email +
      "' and password='" +
      req.body.password +
      "'"
  );
  if (loginCustomer.length > 0) {
    return res.send({
      error: false,
      data: loginCustomer[0].id,
      message: "Login Successfull"
    });
  } else {
    return res.send({ error: false, data: null, message: "Login Failed" });
  }
});

// revised api
// /saveCustomerInitial
router.post("/saveCustomerInitial", async (req, res) => {
  const insertCustomer = await query(
    "INSERT INTO customer (email, password) VALUES ('" +
      req.body.email +
      "', '" +
      req.body.password +
      "')"
  );
  if (insertCustomer) {
    const cartData = req.body.cartData;
    if (cartData.length > 0) {
      for (const i in cartData) {
        await query(
          "INSERT INTO temp_sell (customer_id, item_ids,quantity) VALUES ('" +
            insertCustomer.insertId +
            "', '" +
            cartData[i].productId +
            "','" +
            cartData[i].quantity +
            "')"
        );
      }
    }
    return res.send({
      error: false,
      data: insertCustomer.insertId,
      message: "success"
    });
  }
  return res.json({ message: "error" });
});

router.post("/add_cart_direct", async (req, res) => {
  const checkIfExist = await query(
    "select * from temp_sell where item_ids='" +
      req.body.productId +
      "' and customer_id='" +
      req.body.customerId +
      "'"
  );
  if (checkIfExist.length > 0) {
    await query(
      "UPDATE temp_sell SET quantity= quantity+1 WHERE customer_id = '" +
        req.body.customerId +
        "' and item_ids='" +
        req.body.productId +
        "'"
    );
  } else {
    await query(
      "INSERT INTO temp_sell (customer_id, item_ids,quantity) VALUES ('" +
        req.body.customerId +
        "', '" +
        req.body.productId +
        "','" +
        req.body.quantity +
        "')"
    );
  }
  return res.send({ error: false, data: true, message: "success" });
});

// new api
router.post("/add_cart_direct_from_wish", async (req, res) => {
  const checkIfExist = await query(
    "select * from temp_sell where item_ids='" +
      req.body.productId +
      "' and customer_id='" +
      req.body.customerId +
      "'"
  );
  if (checkIfExist.length > 0) {
    const updateProductTemp = await query(
      "UPDATE temp_sell SET quantity= quantity+'" +
        req.body.quantity +
        "' WHERE customer_id = '" +
        req.body.customerId +
        "' and item_ids='" +
        req.body.productId +
        "'"
    );
  } else {
    const insertProductsTemp = await query(
      "INSERT INTO temp_sell (customer_id, item_ids,quantity) VALUES ('" +
        req.body.customerId +
        "', '" +
        req.body.productId +
        "','" +
        req.body.quantity +
        "')"
    );
  }
  return res.send({ error: false, data: true, message: "success" });
});

router.post("/add_wish_direct", async (req, res) => {
  const checkIfExist = await query(
    "select * from wish_list where item_ids='" +
      req.body.productId +
      "' and customer_id='" +
      req.body.customerId +
      "'"
  );
  if (checkIfExist.length > 0) {
    await query(
      "UPDATE wish_list SET quantity= quantity+1 WHERE customer_id = '" +
        req.body.customerId +
        "' and item_ids='" +
        req.body.productId +
        "'"
    );
  } else {
    await query(
      "INSERT INTO wish_list (customer_id, item_ids, quantity) VALUES ('" +
        req.body.customerId +
        "', '" +
        req.body.productId +
        "','" +
        req.body.quantity +
        "')"
    );
  }
  return res.send({ error: false, data: true, message: "success" });
});

router.post("/saveCustomerAddress", async (req, res) => {
  let updateCustomerShipping = await query(
    "UPDATE customer SET name='" +
      req.body.name +
      "',phone_number='" +
      req.body.phone_number +
      "',address='" +
      req.body.address +
      "',city='" +
      req.body.city +
      "',district='" +
      req.body.district +
      "' WHERE id = '" +
      req.body.customerId +
      "'"
  );
  if (updateCustomerShipping) {
    return res.send({ error: false, data: true, message: "success" });
  }
});

router.post("/getCustomerCartProducts", async (req, res) => {
  let cartProducts = "";
  if (req.body.customerId === 0) {
    const uniqueProductIds = JSON.parse(req.body.uniqueProductIds);
    cartProducts = await query(
      "SELECT id, product_name, product_specification_details_description, productPrice, home_image FROM products WHERE id IN " +
        "(" +
        uniqueProductIds +
        ")" +
        ""
    );
  } else {
    cartProducts = await query(
      "SELECT products.id,products.product_name,products.productPrice,products.product_specification_details_description,products.productPrice*temp_sell.quantity AS totalPrice, products.home_image,temp_sell.item_ids,temp_sell.quantity FROM temp_sell LEFT JOIN products ON temp_sell.item_ids = products.id WHERE temp_sell.customer_id='" +
        req.body.customerId +
        "'"
    );
  }
  return res.send({
    error: false,
    data: cartProducts,
    message: "customer cart product list."
  });
});

// new api
router.post("/getCustomerWishProducts", async (req, res) => {
  let cartProducts = "";
  if (req.body.customerId === 0) {
    const uniqueProductIds = JSON.parse(req.body.uniqueProductIds);
    cartProducts = await query(
      "SELECT id, product_name, product_specification_details_description, productPrice, home_image FROM products WHERE id IN " +
        "(" +
        uniqueProductIds +
        ")" +
        ""
    );
  } else {
    cartProducts = await query(
      "SELECT products.id,products.product_name,products.productPrice,products.product_specification_details_description, products.productPrice*wish_list.quantity AS totalPrice, products.home_image, wish_list.item_ids, wish_list.quantity FROM wish_list LEFT JOIN products ON wish_list.item_ids = products.id WHERE wish_list.customer_id='" +
        req.body.customerId +
        "'"
    );
  }
  return res.send({
    error: false,
    data: cartProducts,
    message: "customer cart product list."
  });
});

// new api
router.post("/updateCustomerCartProducts", async (req, res) => {
  if (req.body.type == 0) {
    await query(
      "UPDATE temp_sell SET quantity=quantity-1 WHERE quantity>0 AND customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  } else {
    await query(
      "UPDATE temp_sell SET quantity=quantity+1 WHERE customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  }
  return res.send({ error: false, message: "Customer cart product updated." });
});

// new api
router.post("/updateCustomerWishProducts", async (req, res) => {
  if (req.body.type == 0) {
    await query(
      "UPDATE wish_list SET quantity=quantity-1 WHERE quantity>0 AND customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  } else {
    await query(
      "UPDATE wish_list SET quantity=quantity+1 WHERE customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  }
  return res.send({ error: false, message: "Customer wish product updated." });
});

// new api
router.post("/deleteCustomerCartProducts", async (req, res) => {
  await query(
    "DELETE FROM temp_sell WHERE customer_id='" +
      req.body.customerId +
      "' AND item_ids='" +
      req.body.itemId +
      "'"
  );
  return res.send({ error: false, message: "Customer cart product deleted." });
});

// new api
router.post("/deleteCustomerWishProducts", async (req, res) => {
  await query(
    "DELETE FROM wish_list WHERE customer_id='" +
      req.body.customerId +
      "' AND item_ids='" +
      req.body.itemId +
      "'"
  );
  return res.send({ error: false, message: "Customer wish product deleted." });
});

// @route   POST api/getVendorData
// @desc    Get vendor details from vendor_details
router.post("/getVendorData", async (req, res) => {
  const vendorData = await query(
    "SELECT name,logo,cover_photo from vendor_details WHERE vendor_id = '" +
      req.body.vendorId +
      "'"
  );

  return res.send({
    error: false,
    data: vendorData[0],
    message: "Vendor Info"
  });
});

// @route   POST api/getVendorCategories
// @desc    Get vendor details
router.post("/getVendorCategories", async (req, res) => {
  try {
    const VendorCategoryData = await query(
      "SELECT DISTINCT(category_id),category_name from products LEFT JOIN category ON category.id = products.category_id WHERE vendor_id = '" +
        req.body.vendorId +
        "'"
    );

    return res.send({
      error: false,
      data: VendorCategoryData,
      message: "Vendor Info"
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

// new api
router.post("/getVendorProductsByCategory", async (req, res) => {
  try {
    const { vendorId, categoryIds } = req.body;

    const ProductData = await query(
      "SELECT id,category_id,product_name,productPrice,home_image,created_date from products WHERE status='active' AND softDelete=0 AND vendor_id = '" +
        vendorId +
        "' AND category_id IN " +
        "(" +
        categoryIds +
        ")" +
        ""
    );
    return res.send({ data: ProductData });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

// new api
router.get("/getAdvertisement", async (req, res) => {
  try {
    const advertData = await query(
      "SELECT image from advertisement WHERE status=1 AND softDel=0"
    );
    return res.send({
      error: false,
      data: advertData[0],
      message: "Advertisement"
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

router.post("/getCustomerCartProductsCount", async (req, res) => {
  const customerProductCount = await query(
    "SELECT COUNT(customer_id) as counting from temp_sell WHERE customer_id = '" +
      req.body.customerId +
      "'"
  );
  return res.send({
    error: false,
    data: customerProductCount,
    message: "customer cart product list."
  });
});

router.get("/all_category_product_list", async (req, res) => {
  try {
    const productLists = await query(`select category.category_name, products.id, products.product_name, products.home_image, products.category_id, products.productPrice
from category join products on category.id = products.category_id
where products.qc_status='yes' and products.status='active' and products.isApprove=1 and products.softDelete=0;`);
    return res.send({
      error: false,
      data: productLists,
      message: "all category product list."
    });
  } catch (e) {
    console.log("Error occured at the of fetching data from product table");
    console.log(e);

    return res.send({
      error: true,
      data: [],
      message: "Error....."
    });
  }
});

// api created by mehedi
router.get("/category_product_list/:cat_id", async (req, res) => {
  try {
    var parentId = req.params.cat_id;

    const productLists = await query(
      "SELECT * FROM products WHERE category_id = " +
        parentId +
        " AND softDelete = 0 AND status = 1"
    );

    return res.send({
      error: false,
      data: productLists,
      message: "all category product list."
    });
  } catch (e) {
    console.log("Error occured at the of fetching data from product table");
    console.log(e);

    return res.send({
      error: true,
      data: [],
      message: "Error....."
    });
  }
});

router.get("/get_terms_conditions", async (req, res) => {
  const termsCOnditions = await query("SELECT * FROM terms_conditions");
  return res.send({
    error: false,
    data: termsCOnditions[0].terms_and_conditions,
    message: "terms"
  });
});

// new api
router.post("/getCustomerInfo", async (req, res) => {
  const customerInfo = await query(
    "SELECT * FROM customer WHERE id='" + req.body.customerId + "'"
  );
  if (customerInfo) {
    const returnData = customerInfo[0];
    return res.send({
      error: false,
      data: returnData,
      message: "Customer Info"
    });
  } else {
    const returnData = [];
    return res.send({
      error: false,
      data: returnData,
      message: "Customer Info"
    });
  }
});

router.post("/searchProductList", async (req, res) => {
  var searchKey = req.body.searchKey;
  const productLists = await query(
    "SELECT * FROM products WHERE product_name LIKE '%" +
      searchKey +
      "%' or product_name LIKE '" +
      searchKey +
      "%' or product_name LIKE '%" +
      searchKey +
      "' or product_name='" +
      searchKey +
      "'"
  );
  return res.send({
    error: false,
    data: productLists,
    message: "all search product list."
  });
});

/*router.get("/search_filter_products", (req, res) => {
  dbConnection.query(
    'SELECT * FROM products WHERE vendor_id = "' +
      req.query.vendorId +
      '" AND category_id = "' +
      req.query.categoryList +
      '"',
    function(error, results, fields) {
      if (error) throw error;
      return res.send({ data: results, message: "data" });
    }
  );
});*/

router.get("/search_filter_products", async (req, res) => {
  const results = await query(
    'SELECT * FROM products WHERE vendor_id = "' +
      req.query.vendorId +
      '" AND category_id = "' +
      req.query.categoryList +
      '"'
  );

  return res.send({ data: results, message: "data" });
});

router.get("/search_purchase_products", (req, res) => {
  var searchedProducts = [];

  new Promise(function(resolve, reject) {
    dbConnection.query(
      'SELECT id FROM products WHERE vendor_id = "' +
        req.query.vendorId +
        '" AND product_name LIKE "%' +
        req.query.id +
        '%" OR product_sku LIKE "%' +
        req.query.id +
        '%" ',
      function(error, results) {
        if (error) throw error;
        if (results.length > 0) {
          resolve(results);
        } else {
          reject("rejected");
        }
      }
    );
  })
    .then(function(purchaseElements) {
      async.forEachOf(
        purchaseElements,
        function(purchaseElement, i, inner_callback) {
          var select_sql =
            "SELECT products.id AS id, products.home_image as home_image, products.product_name AS product_name, products.product_sku AS product_sku FROM products JOIN inv_purchase_details ON products.id = inv_purchase_details.productId WHERE products.id='" +
            purchaseElement.id +
            "' AND inv_purchase_details.productId='" +
            purchaseElement.id +
            "' ";
          dbConnection.query(select_sql, function(err, results, fields) {
            if (!err) {
              if (results.length > 0) {
                searchedProducts.push(results);
              }

              inner_callback(null);
            } else {
              console.log("Error while performing Query");
              inner_callback(err);
            }
          });
        },
        function(err) {
          if (err) {
            //handle the error if the query throws an error
            console.log("Error at ASYNC");
            return res.send({ data: [], message: "data" });
          } else {
            //whatever you wanna do after all the iterations are done
            console.log("Success at ASYNC");
            return res.send({ data: searchedProducts, message: "data" });
          }
        }
      );
    })
    .catch(function(reject) {
      console.log("Rejected");
      return res.send({ data: [], message: "data" });
    });
});

router.get("/product_list", (req, res) => {
  dbConnection.query(
    `SELECT * FROM products WHERE softDelete = 0 AND isApprove='authorize' AND status = 'active' limit 5`,
    function(error, results) {
      if (error) throw error;
      return res.send({
        error: error,
        data: results,
        message: "sepecification name list."
      });
    }
  );
});

router.post("/saveCategory", (req, res) => {
  return res.send(req.body);
});

//mehedi -- 15/01/2020
router.get("/featureproducts/:id", async (req, res) => {
  let resultArr = [];
  try {
    const data = await query(
      `SELECT feature_products FROM feature_products WHERE feature_id=${req.params.id} AND status=1`
    );
    const featureProducts = JSON.parse(data[0].feature_products);

    for (const featureProduct of featureProducts) {
      const products = await query(
        `SELECT * FROM products WHERE isApprove='authorize' AND status='active' AND softDelete=0 AND id=${featureProduct.productId}`
      );

      resultArr = [...resultArr, ...products];
    }
    res.json(resultArr);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

const _getRandomChildArr = async (children, threshold) => {
  let filtered_firstChildren = [];

  for (const { id } of children) {
    const data = await query(
      `SELECT COUNT(*) as no_of_children FROM category WHERE parent_category_id=${id}`
    );

    const { no_of_children } = data[0];

    filtered_firstChildren =
      no_of_children > threshold - 1
        ? [...filtered_firstChildren, { id, no_of_children }]
        : [...filtered_firstChildren];
  }

  return filtered_firstChildren.length > threshold
    ? sampleSize(filtered_firstChildren, threshold)
    : filtered_firstChildren;
};

const _getRandomProductArr = async (children, threshold) => {
  let productArr = [];
  for (const { id, category_name, parent_category_id } of children) {
    const data = await query(`SELECT COUNT(*) as no_of_products FROM products WHERE category_id=${id} AND 
                             softDelete=0 AND isApprove='authorize' AND status='active'`);
    const { no_of_products } = data[0];

    if (no_of_products > threshold - 2) {
      let products = await query(`SELECT id, home_image, category_id FROM products WHERE category_id=${id} AND 
                                  softDelete=0 AND isApprove='authorize' AND status='active'`);
      products =
        products.length > threshold
          ? sampleSize(products, threshold)
          : products;

      const cat_info = { id, category_name, parent_category_id };

      if (products.length) {
        productArr = [...productArr, { cat_info, products }];
      }
    }
  }
  return productArr;
};

const _getChildrenFromCategory = async cat_id => {
  return await query(
    `SELECT * FROM category WHERE parent_category_id=${cat_id} AND status='active'`
  );
};

// route api/feature_category
// desc  Get feature Categories and build the tree
router.get("/feature_category", async (req, res) => {
  let res_arr = [];

  try {
    const featured_categories = await query("SELECT * FROM featured_category");

    for (const fc_id of featured_categories) {
      const { category_id } = fc_id;
      let resObj = {};
      let resNullObj = null;

      const parent = await query(
        `SELECT * FROM category WHERE id=${category_id} AND status='active'`
      );

      if (!parent.length) {
        resObj.parent = null;
        return res.json([...res_arr, resObj]);
      }

      resObj.parent = parent[0];

      const first_children = await _getChildrenFromCategory(category_id);

      if (!first_children.length) {
        resObj.f_children = null;
        return res.json([...res_arr, resObj]);
      }

      const randomFirstChildren = await _getRandomChildArr(first_children, 2);
      // if no children of first_children return lastChildren NULL
      if (!randomFirstChildren.length) {
        resObj.parent = null;
        return res.json([...res_arr, resObj]);
      }

      resObj.f_children = randomFirstChildren;

      let subcatArr = [];

      for (const [i, { id }] of randomFirstChildren.entries()) {
        const l_children = await _getChildrenFromCategory(id);
        const cat = await _getRandomProductArr(l_children, 3);

        if (cat.length) {
          let product_arr = [];
          for (const { products } of cat) {
            product_arr = [...product_arr, ...products];
          }

          const random_product = sampleSize(product_arr, 1)[0];
          const { home_image } = random_product;

          subcatArr = [...subcatArr, { cat_id: id, product_img: home_image }];

          resObj["tree" + (i + 1)] = cat;
        } else {
          resObj["tree" + (i + 1)] = null;
          subcatArr = [...subcatArr, {}];
        }
      }

      resObj.subCat = subcatArr;

      if (
        !(resObj.hasOwnProperty("tree1") || resObj.hasOwnProperty("tree2")) ||
        resObj.subCat === null
      ) {
        resObj.parent = null;
        res_arr = [...res_arr, resObj];
      } else {
        res_arr = [...res_arr, resObj];
      }
    }

    return res.json(res_arr);
  } catch (e) {
    console.error(e.message);
    res.send("Server Error");
  }
});

// route api/vendors
// desc  get all vendors for index page
router.get("/vendors", async (req, res) => {
  try {
    const data = await query(`SELECT vd.id, vd.vendor_id, vd.logo 
                              FROM vendor_details vd JOIN vendor v ON v.id=vd.vendor_id;`);
    res.json(data);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
