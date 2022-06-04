const { prompt } = require("inquirer");
const logo = require("asciiart-logo");

require("console.table");
const db = require("./db/connection");

db.connect(function(){
  console.log("Employee tracker");
  init();
})



// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
    type: "list",
    name: "choice",
    message:"What would you like to see?",
    choices:["View all Employee","View all Department", "View all role", "employee update", "add employes", "add a role","Exit App"]
    }

  ]).then(response => {
    switch(response.choice){
      case "View all Employee":
        viewAllEmployee();
        break;
      
        case "View all Department":
        viewAllDepartment();
        break;

        case "View all role":
        viewAllrole();
        break;

        case "employee update":
        employeeupdate();
        break;

        case "add employee":
          addemployee();
          break; 

          case "add a role":
            addarole();
            break;  
            default:
              db.end()
              process.exit(0)
    }
  })


  }