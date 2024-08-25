const { Command } = require('commander');
const program = new Command();
const fs = require("fs");

function readFileAsync(filePath){
    return new Promise(function(resolve,reject){
        fs.readFile(filePath,'utf-8',function(err,data){
            if(err){
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};

function writeFileAsync(filePath,data){
    return new Promise(function(resolve,reject){
        fs.writeFile(filePath,data,(err)=>{
            if(err){
                reject(err);
            } else {
                resolve();
            }
        })
    })
}


async function adding(str){
    let data = await readFileAsync('todos.json');
    var myObject = eval('(' + data + ')');
    myObject.push({"task":str,"isDone":false});
    let newList = JSON.stringify(myObject);
    await writeFileAsync('todos.json',newList);
    console.log(`${str} added in list!`);
}

async function removing(str){
    let data = await readFileAsync('todos.json');
    var myObject = eval('(' + data + ')');
    if(myObject.length===0 || myObject.filter((element)=>{return element.task===str}).length===0){
        console.log(`${str} not present!`);
        return;
    };
    myObject = myObject.filter((element)=>{
        return element.task != str; 
    });
    let newList = JSON.stringify(myObject);
    await writeFileAsync('todos.json',newList);
    console.log(`${str} removed from the list!`);
}

async function markAsDone(str){
    let data = await readFileAsync('todos.json');
    var myObject = eval('('+data+')');

    if(myObject.filter((element)=>{return element.task === str}).length === 0){
        console.log(`${str} doesn't exist`);
        return;
    }

    myObject.map((element)=>{
        if(element.task===str){
            element.isDone = true;
        };
    });
    let newList = JSON.stringify(myObject);
    await writeFileAsync('todos.json',newList);
    console.log(`${str} marked as done!`);
}

async function removeall(){
    let data = await readFileAsync('todos.json');
    var myObject = eval('('+data+')');
    if(myObject.length === 0){
        console.log('No tasks present!');
        return;
    }

    let newList = '[]';
    await writeFileAsync('todos.json',newList);
    console.log(`All tasks removed`);
}

async function removeCompleted(){
    let data = await readFileAsync('todos.json');
    var myObject = eval('('+data+')');
    myObject = myObject.filter((element)=>{
        return !element.isDone;
    });
    let newList = JSON.stringify(myObject);
    await writeFileAsync('todos.json',newList);
    console.log(`Completed tasks removed from the list!`);
}

program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');


program.command('add')
  .description('Adds a task in the todo list')
  .argument('<string>', 'name of the task')
  .action((str) => {
    adding(str);
  });

program.command('remove')
    .description('Removes a task from the list')
    .argument('<string>','name of the task')
    .action((str)=>{
        removing(str);
    });

program.command('done')
    .description('Marks a task as done')
    .argument('<string>','name of the task')
    .action((str)=>{
        markAsDone(str);
    });


program.command('removeall')
    .description('Removes a task from the list')
    .action(()=>{
        removeall();
});

program.command('cleardone')
    .description('Clears tasks marked as done')
    .action(()=>{
        removeCompleted();
});

program.parse();