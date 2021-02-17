<template>
  <div class="app-content">
    <div v-if="showProducts">
      <div class="sortBy">
        <label for="category">Choose a category to sort with:</label>
        <select
          name="category"
          id="category"
          @change="onChangeCategory($event)"
        >
          <option value="subject">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="spaces">Spaces</option>
        </select>
        <br /><br />
        <label for="order">Choose an ascending or descending order:</label>
        <select name="order" id="order" @change="onChangeOrder($event)">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <br /><br />
      </div>
      <!-- <div v-for="item in user" :key="item.id"> -->
      <!-- <h2>Current Logged in User is: {{user.email}}</h2> -->
      <!-- <h2>Password:{{user.password}}</h2> -->
      <!-- </div> -->
      <div class="productList">
        <div v-for="item in lessons" :key="item._id" class="product">
          <!-- {{item._id}} -->
          <div class="productTop">
            <img class="image" v-bind:src="item.img_link" />
            <div class="productText">
              <h3>{{ item.subject }}</h3>
              <p>{{ item.location }}</p>
              <p>price:{{ item.price }}</p>
              <p>spaces:{{ item.quantity }}</p>
            </div>
          </div>
          <button v-on:click="addToCart(item._id)" class="button">
            Add to Cart
          </button>
        </div>
      </div>
      <div v-if="showCheckoutButton">
        <button
          type="button"
          class="checkoutButton"
          v-on:click="displayCheckout()"
        >
          Checkout
        </button>
      </div>
    </div>
    <div v-if="showCheckout">
      <div class="productList">
        <div
          v-for="element in checkoutItems"
          :key="element.id"
          class="productBought"
        >
          <div class="productTop">
            <img class="image" v-bind:src="element.img" />
            <div class="productText">
              <h3>{{ element.subject }}</h3>
              <p>{{ element.location }}</p>
              <p>price:{{ element.price }}</p>
              <p>Quantity: {{ element.quantity }}</p>
            </div>
          </div>
          <button v-on:click="deleteItem(element.id)" class="button">
            Cancel item
          </button>
        </div>
      </div>
      <button type="button" v-on:click="displayProducts()">Go back</button>
      <h3>Please specify your name:</h3>
      <input
        type="text"
        name="name"
        v-model="name"
        id="name"
        v-on:keypress="
          isLetter();
          checkForm();
        "
        v-on:keyup="checkForm()"
      />
      <h3>Please specify your number:</h3>
      <input
        type="text"
        name="number"
        id="number"
        v-model="number"
        v-on:keypress="
          isNumber();
          checkForm();
        "
        v-on:keyup="checkForm()"
        maxlength="11"
      />
      <p v-if="showError" style="color:red">
        Incomplete form or invalid characters entered!
      </p>
      <div v-if="showSubmitButton">
        <button type="button" v-on:click="checkout()">Submit Order</button>
      </div>
      <h1 v-if="showSuccess" style="color:green">
        Thank you for buying these products! Have a nice day
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",

  data() {
    return {
      lessons: [],
      checkoutItems: [],
      object: {},
      order: "asc",
      category: "subject",
      showProducts: true,
      showCheckoutButton: false,
      showCheckout: false,
      showSuccess: false,
      showError: false,
      showSubmitButton: false,
      name: "",
      number: "",
      isLet: false,
      isNum: false,
    };
  },
  mounted() {
    this.getAllLessons();

    // this.getUser();
  },
  // created(){
  //   this.checkUpdateStock();
  // },
  methods: {
    checkout(){
      let bodyUpdate={}
      this.checkoutItems.forEach(element => {
        const body={
          id:element.id,
          quantity:element.quantity,
          price:element.price,
          user:this.name,
          number:this.number
        }
        this.lessons.forEach(el => {
          if(el._id==element.id){
            bodyUpdate={
            id:element.id,
            $set:{quantity:el.quantity}
        }
          }
        });
        
        fetch("http://localhost:8080/api/products/order",{
          method:"post",
          body:JSON.stringify(body),
          headers:{"Content-Type":"application/json"}
  
        })
          .then((response) => {if(response.status==200){
            this.showSuccess=true;
            localStorage.clear();
            this.checkoutItems=[];
            

          }})
             try {
               
               fetch("http://localhost:8080/api/products/order",{
              method:"put",
              body:JSON.stringify(bodyUpdate),
              headers:{"Content-Type":"application/json"}
            })
              console.log("success")
             } catch (error) {
               console.log(error)
             }
          // .then((response)=>{if(response.status==200){
          //   this.showSuccess=true;
          // }})
          // .then((data) => {
            // console.log(data)
          // });
        
      });
    },
    checkForm() {
      if (this.isLet && this.isNum && this.number != "" && this.name != "") {
        this.showSubmitButton = true;
        console.log(this.number);
        this.showError = false;
      } else {
        this.showSubmitButton = false;
        this.showError = true;
      }
    },
    isLetter() {
      let nm = this.name;
      console.log("step 1");
      if (/^[A-Za-z]+$/.test(nm)) {
        this.isLet = true;
        console.log("step 2");
        // this.showError=false;
      } else {
        this.isLet = false;
        // this.showError=true;
      }
    },
    isNumber() {
      let num = this.number;
      console.log("here 1");
      if (/^\d+$/.test(num)) {
        this.isNum = true;
        console.log("here 2");
        this.showError = false;
      } else {
        this.isNum = false;
        this.showError = true;
      }
    },
    getAllLessons() {
      fetch("http://localhost:8080/api/products")
        .then((response) => response.json())
        .then((data) => {
          this.lessons = data;
          this.checkUpdateStock();
          this.checkCheckout();
        });
    },
    checkUpdateStock() {
      this.checkoutItems = JSON.parse(localStorage.product);
      this.lessons.forEach((element) => {
        this.checkoutItems.forEach((el) => {
          if (element._id == el.id) {
            element.quantity = element.quantity - el.quantity;
          }
        });
      });
    },
    checkCheckout() {
      if (this.checkoutItems.length != 0) {
        this.showCheckoutButton = true;
      } else {
        this.showCheckoutButton = false;
      }
    },
    addToCart(id) {
      let itemNotFound = true;
      this.lessons.forEach((element) => {
        if (element._id == id && element.quantity != 0) {
          this.object = {
            id: element._id,
            subject: element.subject,
            location: element.location,
            price: element.price,
            img: element.img_link,
            quantity: 1,
          };
          this.checkoutItems.forEach((el) => {
            if (el.id == element._id) {
              el.quantity++;
              itemNotFound = false;
            }
          });
          element.quantity--;
          if (itemNotFound || this.checkoutItems.length == 0) {
            this.checkoutItems.push(this.object);
          }
          console.log(this.checkoutItems);

          localStorage.product = JSON.stringify(this.checkoutItems);
          this.checkCheckout();
        }
      });
    },
    onChangeCategory(event) {
      //every time an event is sent, the sort is caled
      console.log(event.target.value);
      this.category = event.target.value;
      this.sortBy();
    },
    displayCheckout() {
      this.showProducts = false;
      this.showCheckout = true;
      // this.checkoutItems = JSON.parse(localStorage.product_id);
      this.showSuccess = false;
    },
    displayProducts() {
      this.showProducts = true;
      this.showCheckout = false;
      this.checkCheckoutButton();
    },
    onChangeOrder(event) {
      console.log(2);
      console.log(event.target.value);
      this.order = event.target.value;
      this.sortBy();
    },
    deleteItem(id) {
      for (let i = 0; i < this.checkoutItems.length; i++) {
        if (this.checkoutItems[i].id == id) {
          this.checkoutItems[i].quantity--;
          this.lessons.forEach((element) => {
            if (element._id == id) {
              element.quantity++;
            }
          });
          if (this.checkoutItems[i].quantity == 0) {
            this.checkoutItems.splice(i, 1);
          }
        }
      }
      localStorage.product = JSON.stringify(this.checkoutItems);
    },
    sortBy() {
      console.log(3);
      if (this.order == "asc") {
        //ascendent sort
        this.lessons.sort((a, b) =>
          a[this.category] < b[this.category] ? -1 : 1
        );
        console.log(this.category);
      } else if (this.order == "desc") {
        //descending sort
        this.lessons.sort((a, b) =>
          a[this.category] > b[this.category] ? -1 : 1
        );
      }
    },

    // getUser() {
    //   fetch("http://localhost:5000/api/user")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       this.user = data;
    //     });
    // },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.productList {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  flex-wrap: wrap;
}
.product {
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
}
.productTop {
  width: 400px;
  height: 200px;
  display: flex;
  margin-bottom: 10px;
}
.image {
  width: 50%;
}
.productText {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;

  justify-content: space-between;
  height: 100%;
}
.button {
  width: 100%;
  cursor: pointer;
  background-color: lightseagreen;
}
.checkoutButton {
  width: 80%;
  /* margin-left: 10%; */
  background-color: lightgreen;
  cursor: pointer;
}
.sortBy {
  margin: 0 auto;
  width: 80%;
  background-color: grey;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: x-large;
  flex-wrap: wrap;
}
.sortBy select {
  width: 350px;
}
.sortBy label {
  width: 350px;
}
.productBought {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  justify-content: space-between;
}
</style>
