// selecting student involvement point form elements and other components from HTML file
const pointForm = document.querySelector("#pointForm")
const firstName = document.querySelector("#firstName")
const lastName = document.querySelector("#lastName")
const date = document.querySelector("#date")
const grade = document.querySelector("#grade")
const checkbox = document.querySelector("#checkbox")
const button = document.querySelector("#button")
const winnerButton=document.querySelector("#winnerButton")
const topPointsWinnerText=document.querySelector("#topPointsWinner")
const randWinnerText=document.querySelector("#randWinnerText")
const reportButton=document.querySelector("#report")
const modal = document.querySelector("#modal")
const closeButton=document.querySelector("#close")
let data=[]



//function that sends get request to express server and unpacks JSON data into 2D format in data variable
async function readStudentData() {
    //intializing preprocessed and processed data variables
    let preprocessedData;
   
    //waiting for JSON response from express server and extracting data from response object
    const response = await fetch("http://localhost:3000/data");
    preprocessedData = await response.json();
    //putting correct form of preproccessed data into 2D array data variable
    // Format of data for each student is [First Name, Last Name, Grade, Date,Points] along with some example students
    preprocessedData["students"].forEach(element => data.push([element["firstName"],element["lastName"],element["grade"],element["date"],element["points"]]));
  }

readStudentData()

modal.innerHTML=""

// listening for an submisssion for the adding point form
pointForm.addEventListener("submit",function(e)
{
    e.preventDefault();

    // if checkbox is not checked then add entry to data
    if(!checkbox.checked){
        data.push([firstName.value,lastName.value,grade.value,date.value,1])
        
        //preparing data to be into JSON format for POST Request
        let sendData={students:[]}
        data.forEach(entry =>sendData["students"].push({
            
            firstName:entry[0],
            lastName:entry[1],
            grade:entry[2],
            date:entry[3],
            points:entry[4]
                
        }));
        // POST method implementation:
        //defining function will send fetch post request to express server to save new student entry to local JSON File
        async function postData() {

            //initializing default response object that will be converted to JSON
            const response = await fetch("http://localhost:3000/updateData", {
            method: "POST", 
            mode: "cors", 
            cache: "no-cache", 
            credentials: "same-origin", 
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", 
            referrerPolicy: "no-referrer", 
            body: JSON.stringify(sendData), 
            });

            return response.json(); // 
        }

        //running function
       postData()

       
    }

    // else checkbox is checked then add entry to data
    else{
        for(let i=0; i<data.length;i++){
            if (data[i][0] == firstName.value && data[i][1] == lastName.value){
                data[i][4]++;
            }
        }

        let sendData={students:[]}
        data.forEach(entry =>sendData["students"].push({
            
            firstName:entry[0],
            lastName:entry[1],
            grade:entry[2],
            date:entry[3],
            points:entry[4]
                
        }));

        // POST method implementation:
        //defining function will send fetch post request to express server to save new student entry to local JSON File
        async function postData() {

            //initializing default response object that will be converted to JSON
            const response = await fetch("http://localhost:3000/updateData", {
            method: "POST", 
            mode: "cors", 
            cache: "no-cache", 
            credentials: "same-origin", 
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", 
            referrerPolicy: "no-referrer", 
            body: JSON.stringify(sendData), 
            });

            return response.json(); // 
        }

        //running function
       postData()
       
    }

    
    button.classList.remove("btn-danger")
    button.classList.add("btn-success")
    button.innerHTML="Added!"
    setTimeout(() => {
    button.classList.remove("btn-success")
    button.classList.add("btn-danger")
    button.innerHTML="Submit"
    }, "3000");
    

});


winnerButton.addEventListener("click",function()
{   

    // creates an array of all point values
    pointsArray=[]
    for(let i = 0; i<data.length;i++){
        pointsArray.push(data[i][4])
    }
    
    // finds the maximum points value and then finds the index of the student with that many points
    let maxPoints=Math.max(...pointsArray);
    let maxWinnerIndex = pointsArray.indexOf(maxPoints);

    // displays the winner's name on the website
    let topPointswinnerName = data[maxWinnerIndex][0]+" "+data[maxWinnerIndex][1];
    topPointsWinnerText.innerHTML=topPointswinnerName+"  is the winner of the pizza party with "+maxPoints.toString() + " Points!"

    let randWinnerNum = Math.floor(Math.random() * (data.length))
    

    let randWinnerName=data[randWinnerNum][0] + " "+ data[randWinnerNum][1]

    // checks which prize the student gets depending on how many points they have
    if (data[randWinnerNum][4]<5){
        randWinnerText.innerHTML = randWinnerName + " won a Homework Pass!"
    }
    else{
        randWinnerText.innerHTML = randWinnerName + " won a free PHS Spirit T-Shirt!"
    }
    
});


// Adding each entry to list in modal when user generates quaretely report when pressing on button

reportButton.addEventListener("click",function()
{
    for (let i=0;i<data.length;i++)
    {   
        // Creating HTML elements,adding the data to it, and appending it to the list
        let reportItem=document.createElement("li")
        reportItem.classList.add("list-group-item","d-flex","justify-content-between","align-items-start")
        let reportItemDiv1=document.createElement("div")
        reportItemDiv1.classList.toggle("ms-2")
        reportItemDiv1.classList.toggle("me-auto")
        let reportItemDiv2=document.createElement("div")
        reportItemDiv2.classList.add("fw-bold")
        reportItemDiv2.innerHTML= data[i][0]+" " + data[i][1]+ ", Grade "+ data[i][2].toString() 
        reportItemDiv1.appendChild(reportItemDiv2)
        reportItem.appendChild(reportItemDiv1)
        let reportItemSpan=document.createElement("span")
        reportItemSpan.innerHTML=data[i][4]
        reportItemSpan.classList.add("badge","bg-primary","rounded-pill")
        reportItem.appendChild(reportItemSpan)
        modal.appendChild(reportItem)

    }
}
)


// deleting modal information when modal is closed
closeButton.addEventListener("click",function()
{
    modal.innerHTML=""
})