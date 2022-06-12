const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const mysql = require("mysql2")
require("dotenv")
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tyrell1125!",
  database: "employeetracker"
})


require("console.table");
//const db = require("./db/connection");

db.connect(function () {
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
      message: "What would you like to do?",
      choices: ["View all Employee", "View all Department", "add department", "View all role", "employee update", "add employees", "add a role", "Exit App"]
    }

  ]).then(response => {
    switch (response.choice) {
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
        addEmployee();
        break;

      case "add department":
        addDepartment();
        break;

      case "add a role":
        addaRole();
        break;
      default:
        db.end()
        process.exit(0)
    }
  })


}

// View all employee
function viewAllEmployee() {
  db.query("select * from employee;", function (err, rows) {
    if (err) throw err;
    console.log("\n");
    console.table(rows);
    loadMainPrompts();
  })

}

// View all department
function viewAllDepartment() {
  db.query("select * from department;", function (err, rows) {
    if (err) throw err;
    console.log("\n");
    console.table(rows);
    loadMainPrompts();
  })

}
//add department
function addDepartment() {
  prompt([{
    type: "input",
    name: "departmentname",
    message: "create a new department",
  }]).then(response => {
    db.query("INSERT INTO department (name) VALUES(?);",
      response.departmentname, function (err, rows) {
        if (err) throw err;
        console.log("\n");
        console.table(rows);
        loadMainPrompts();
      })
  })

}

//add role
function addaRole() {
  prompt([{
    type: "input",
    name: "rolename",
    message: "create a new role",
  }]).then(response => {
    db.query("INSERT INTO role (name) VALUES(?);",
      response.rolename, function (err, rows) {
        if (err) throw err;
        console.log("\n");
        console.table(rows);
        loadMainPrompts();
      })
  })

}

//add employee
function addemployee() {
  prompt([{
    type: "input",
    name: "employeename",
    message: "what is the employee's first name?",
  }]).then(response => {
    db.query("INSERT INTO employee (name) VALUES(?);",
      response.rolename, function (err, rows) {
        if (err) throw err;
        console.log("\n");
        console.table(rows);
        loadMainPrompts();
      })
  })

}

// employee update
function employeeupdate() {
  prompt([{
    type: "input",
    name: "employeeupdate",
    message: "update employee status",
  }]).then(response => {
    db.query("INSERT INTO employee update (name) VALUES(?);",
      response.rolename, function (err, rows) {
        if (err) throw err;
        console.log("\n");
        console.table(rows);
        loadMainPrompts();
      })

  })

}



//   const departmentChoices = departments.map(({ id, name }) => ({
//     name: name,
//     value: id
//   }));

//   prompt([
//     {
//       type: "list",
//       name: "departmentId",
//       message: "Which department would you like to see employees for?",
//       choices: departmentChoices
//     }
//   ])
//     .then(res => db.findAllEmployee(res.departmentId))
//     .then(([rows]) => {
//       let employees = rows;
//       console.log("\n");
//       console.table(employees);
//})
// View all employees that report to a specific manager
function viewEmployeesByManag() {
  db.findAllEmployees()
    .then(([rows]) => {
      let managers = rows;
      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "managerId",
          message: "Which employee do you want to see direct reports for?",
          choices: managerChoices
        }
      ])
        .then(res => db.findAllEmployeesByManager(res.managerId))
        .then(([rows]) => {
          let employees = rows;
          console.log("\n");
          if (employees.length === 0) {
            console.log("The selected employee has no direct reports");
          } else {
            console.table(employees);
          }
        })
        .then(() => loadMainPrompts())
    });
}

// Delete an employee
function removeEmployee() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: employeeChoices
        }
      ])
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log("Removed employee from the database"))
        .then(() => loadMainPrompts())
    })
}

// Update an employee's role
function updateEmployeeRole() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "What employee's role do you want to update?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          let employeeId = res.employeeId;
          db.findAllRoles()
            .then(([rows]) => {
              let roles = rows;
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role do you want to assign to the selected employee?",
                  choices: roleChoices
                }
              ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("Updated employee's role"))
                .then(() => loadMainPrompts())
            });
        });
    })
}

// Update an employee's manager
function updateEmployeeManager() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's manager do you want to update?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          let employeeId = res.employeeId
          db.findAllPossibleManagers(employeeId)
            .then(([rows]) => {
              let managers = rows;
              const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "managerId",
                  message:
                    "Which employee do you want to set as manager for the selected employee?",
                  choices: managerChoices
                }
              ])
                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                .then(() => console.log("Updated employee's manager"))
                .then(() => loadMainPrompts())
            })
        })
    })
}

// View all roles
function viewAllrole() {
  db.query("select * from roles;", function (err, rows) {
    if (err) throw err;
    console.log("\n");
    console.table(rows);
    loadMainPrompts()

  })
}

// // Add a role
function addRole() {
  db.findAllDepartments()
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      prompt([
        {
          name: "title",
          message: "What is the name of the role?"
        }, {

          name: "salary",
          message: "What is the salary of the role?"
        },
        {
          type: "list",
          name: "department_id",
          message: "What role does the department belong to?",
          choices: departmentChoices
        }
      ])
        .then(role => {
          db.createRole(role)
            .then(() => console.log(`Added ${role.title} to the database`))
            .then(() => loadMainPrompts())
        })
    })
}

// Delete a role
function removeRole() {
  db.findAllRoles()
    .then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "roleId",
          message:
            "Which role do you want to remove? (Warning: This will also remove employees)",
          choices: roleChoices
        }
      ])
        .then(res => db.removeRole(res.roleId))
        .then(() => console.log("Removed role from the database"))
        .then(() => loadMainPrompts())
    })
}




// Add a department
// function addDepartment() {
//   prompt([
//     {
//       name: "name",
//       message: "What's the department name?"
//     }
//   ])
//     .then(res => {
//       let name = res;
//       db.createDepartment(name)
//         .then(() => console.log(`Added ${name.name} to the database`))
//         .then(() => loadMainPrompts())
//     })
// }

// Delete a department
function removeDepartment() {
  db.findAllDepartments()
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      prompt({
        type: "list",
        name: "departmentId",
        message:
          "What department would you like to remove? (Warning: This will also remove associated roles and employees)",
        choices: departmentChoices
      })
        .then(res => db.removeDepartment(res.departmentId))
        .then(() => console.log(`Removed department from the database`))
        .then(() => loadMainPrompts())
    })
}

// View all departments and show their total utilized department budget
function viewUtilizedBudgetByDepartment() {
  db.viewDepartmentBudgets()
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}


// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}