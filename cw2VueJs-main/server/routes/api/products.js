const express = require("express")
const mongodb  = require("mongodb")


const router= express.Router();


//get products////////////////////////////////////////////////////

router.get("/",async(req,res)=>{
    const products=await loadProductsCollection();
    res.send(await products.find({}).toArray());
})


router.get("/order",async(req,res)=>{
    const products=await loadOrdersCollection();
    res.send(await products.find({}).toArray());
})
//add products//////////////////////////////////////////////////////////////

router.post("/", async(req,res)=>{
    const products=await loadProductsCollection();
    await products.insertOne({
        subject: req.body.subject,
        location:req.body.location,
        price:req.body.price,
        quantity:req.body.quantity,
        img_link:req.body.img
    });
    res.status(201).send();
})



router.post("/order", async(req,res)=>{
    const products=await loadOrdersCollection();
    await products.insertOne({
        id: req.body.id,
        quantity:req.body.quantity,
        price:req.body.price,
        user:req.body.user,
        number:req.body.number
    });
    
    res.status(200).send();
})


//delete products///////////////////////////////////////////////

router.delete("/:id", async(req,res)=>{
    const products=await loadProductsCollection();
    await products.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
    res.status(200).send();
})


//update products*************************************************
router.put("/order", async(req,res)=>{
    const products=await loadProductsCollection();
    console.log(new mongodb.ObjectID)
    await products.updateOne({_id:new mongodb.ObjectID(req.body.id)},{$set:req.body.$set},{upsert:true})
    res.status(200).send();
})


async function loadProductsCollection(){
    const client=await mongodb.MongoClient.connect("mongodb+srv://UserMongo:1234%40Middlesex@products.ysvpf.mongodb.net/vue?retryWrites=true&w=majority", { useNewUrlParser: true })

    return client.db("vue").collection("products")
}
async function loadOrdersCollection(){
    const client=await mongodb.MongoClient.connect("mongodb+srv://UserMongo:1234%40Middlesex@products.ysvpf.mongodb.net/vue?retryWrites=true&w=majority", { useNewUrlParser: true })

    return client.db("vue").collection("orders")
}

module.exports = router;
