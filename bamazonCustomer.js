const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    } else {
        console.log("connection successful!");
        listAllMyShit();
    }
});

function chooseUselessCrap() {
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "We only have one type of useless crap today, so no choice bitch, if you don't want what we're selling, then type q to quit, like the pussy you are. If you got money to burn, then indicate the id number.",
        }]).then(function(answer) {
            var userInput = answer.choice;
            if (userInput === "q") {
                console.log("Goodbye. Can't say I'll miss ya!")
            } else {
                var query = "SELECT * FROM products WHERE ?";
                connection.query(query, { id: answer.choice }, function(err, res) {
                    console.log("You want " + res[0].product_name + "?");
                    howMuchUWant(answer.choice);
                })

            }
        })
}


function listAllMyShit() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        chooseUselessCrap();
    });
}

function howMuchUWant(ID) {
    inquirer
        .prompt([{
            type: "input",
            name: "amount",
            message: "You must be desperate to want that shit. How much you want?",
        }]).then(function(answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { id: ID }, function(err, res) {
               if (answer.amount > res[0].stock_quantity) {
                    console.log("Damn! We don't have that much crap! What type of place do you think this is? Amazon.com? We only have " + res[0].stock_quantity + res[0].product_name)
                } else {
                    console.log("Seriously? You want " + answer.amount + " " + res[0].product_name + "? All right. It's your life.")
                    decrementStockQuantity(answer.amount, ID)
                    var totalCost = parseInt(res[0].price) * parseInt(answer.amount)
                    console.log("That'll cost you " + totalCost
                    	+ ". Pay up sucker")
                }

            });
        })

}

function decrementStockQuantity(quantity, ID) {
   var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?"
    connection.query(query, [quantity, ID], function(err, res) {
        // console.table(res);
        listAllMyShit();
   });
}