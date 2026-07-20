/* ==========================================
   Water Bottle Manager
   script.js Part 1
   ========================================== */


// -----------------------------
// App Data
// -----------------------------

let bottleData = JSON.parse(
    localStorage.getItem("bottleData")
) || {};

let bottlePrice = 
    Number(localStorage.getItem("bottlePrice")) || 20;


let currentDate = new Date();

let selectedDate = null;


// -----------------------------
// Initialize App
// -----------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.getElementById(
            "bottlePrice"
        ).value = bottlePrice;


        renderCalendar();

        calculateTotals();

        generateReports();

    }
);



// -----------------------------
// Navigation
// -----------------------------

function showPage(page,id){

    document
    .querySelectorAll(".page")
    .forEach(p=>{
        p.classList.remove("active");
    });


    document
    .getElementById(page)
    .classList.add("active");


    document
    .querySelectorAll(".bottom-nav button")
    .forEach(btn=>{
        btn.classList.remove("active");
    });


    id.classList.add("active");



    if(page==="reports"){

        generateReports();

    }

}



// -----------------------------
// Calendar
// -----------------------------


function renderCalendar(){


    let calendar =
    document.getElementById("calendar");


    calendar.innerHTML="";


    let year =
    currentDate.getFullYear();


    let month =
    currentDate.getMonth();



    document.getElementById(
        "monthYear"
    ).innerText =
    new Date(
        year,
        month
    ).toLocaleString(
        "default",
        {
            month:"long",
            year:"numeric"
        }
    );



    let firstDay =
    new Date(
        year,
        month,
        1
    ).getDay();



    let days =
    new Date(
        year,
        month+1,
        0
    ).getDate();



    for(
        let i=0;
        i<firstDay;
        i++
    ){

        let empty =
        document.createElement("div");

        calendar.appendChild(empty);

    }



    for(
        let d=1;
        d<=days;
        d++
    ){


        let div =
        document.createElement("div");


        let dateKey =
        formatDate(
            new Date(
                year,
                month,
                d
            )
        );



        let count =
        bottleData[dateKey] || 0;



        div.className =
        "day " +
        (
            count>0
            ?
            "green"
            :
            "gray"
        );



        if(
            isToday(
                year,
                month,
                d
            )
        ){

            div.classList.add(
                "today"
            );

        }



        div.innerHTML = `

        <div class="day-number">
        ${d}
        </div>


        <div class="count">
        ${count} Bottle
        </div>


            <button 
        class="minus-btn"
        onclick="event.stopPropagation();removeBottle('${dateKey}')">

        −

        </button>


        <button 
        class="add-btn"
        onclick="event.stopPropagation();addBottle('${dateKey}')">

        +

        </button>

        `;



        div.onclick=()=>{
            openDateModal(
                dateKey
            );
        };



        calendar.appendChild(div);


    }


}



// Previous Month

document
.getElementById("prevMonth")
.onclick=()=>{

    currentDate.setMonth(
        currentDate.getMonth()-1
    );

    renderCalendar();

};



// Next Month

document
.getElementById("nextMonth")
.onclick=()=>{


    currentDate.setMonth(
        currentDate.getMonth()+1
    );


    renderCalendar();

};





// -----------------------------
// Date Helpers
// -----------------------------

function formatDate(date){

    let year =
    date.getFullYear();


    let month =
    String(
        date.getMonth()+1
    ).padStart(2,"0");


    let day =
    String(
        date.getDate()
    ).padStart(2,"0");


    return `${year}-${month}-${day}`;

}


function isToday(y,m,d){


    let today =
    new Date();


    return (

        y===today.getFullYear()

        &&

        m===today.getMonth()

        &&

        d===today.getDate()

    );

}



// -----------------------------
// Add Bottle
// -----------------------------


function addBottle(date){


    if(!bottleData[date]){

        bottleData[date]=0;

    }


    bottleData[date]++;


    saveData();


    renderCalendar();


    calculateTotals();


    generateReports();


}

// -----------------------------
// Remove Bottle
// -----------------------------

function removeBottle(date){


    if(!bottleData[date]){
        return;
    }


    bottleData[date]--;


    if(bottleData[date] <= 0){

        delete bottleData[date];

    }


    saveData();


    renderCalendar();


    calculateTotals();


    generateReports();


}




// -----------------------------
// Save Data
// -----------------------------


function saveData(){


    localStorage.setItem(
        "bottleData",
        JSON.stringify(bottleData)
    );


}



// -----------------------------
// Date Modal
// -----------------------------


function openDateModal(date){


    selectedDate=date;


    document.getElementById(
        "selectedDate"
    ).innerText=date;



    let count =
    bottleData[date] || 0;



    document.getElementById(
        "selectedCount"
    ).innerText=count;



    document.getElementById(
        "selectedCost"
    ).innerText =
    "₹"+
    (
        count*bottlePrice
    );



    document.getElementById(
        "dateModal"
    ).style.display="flex";


}



function closeModal(){


    document.getElementById(
        "dateModal"
    ).style.display="none";


}



function addBottleFromModal(){


    addBottle(
        selectedDate
    );


    openDateModal(
        selectedDate
    );

}
/* ==========================================
   script.js Part 2
   Calculations, Reports, Settings
   ========================================== */


// -----------------------------
// Automatic Calculations
// -----------------------------
function calculateTotals(){

    // Get today's date correctly
    let today = formatDate(new Date());


    // Today's bottle count
    let todayCount = Number(
        bottleData[today] || 0
    );


    document.getElementById(
        "todayBottle"
    ).innerText = todayCount;


    document.getElementById(
        "todayCost"
    ).innerText =
    "₹" + (todayCount * bottlePrice);



    let now = new Date();


    let monthCount = 0;

    let overallCount = 0;



    Object.keys(bottleData).forEach(date=>{


        let count =
        Number(bottleData[date]);


        overallCount += count;



        let savedDate =
        new Date(
            date + "T00:00:00"
        );


        if(
            savedDate.getMonth() === now.getMonth()
            &&
            savedDate.getFullYear() === now.getFullYear()
        ){

            monthCount += count;

        }


    });



    document.getElementById(
        "monthBottle"
    ).innerText =
    monthCount;



    document.getElementById(
        "monthCost"
    ).innerText =
    "₹" + (monthCount * bottlePrice);



    document.getElementById(
        "overallBottle"
    ).innerText =
    overallCount;



    document.getElementById(
        "overallCost"
    ).innerText =
    "₹" + (overallCount * bottlePrice);

}




// -----------------------------
// Reports
// -----------------------------


function generateReports(){


    generateDailyReport();

    generateMonthlyReport();


}



// -----------------------------
// Daily Report
// -----------------------------


function generateDailyReport(){


    let table =
    document.getElementById(
        "dailyReport"
    );


    if(!table)
    return;


    table.innerHTML="";



    let totalBottle=0;



    Object.keys(bottleData)

    .sort()

    .forEach(date=>{


        let count =
        bottleData[date];


        let cost =
        count*bottlePrice;



        totalBottle += count;



       table.innerHTML += `
<tr>
    <td>${date}</td>
    <td>${count}</td>
    <td>₹${cost}</td>
    <td>
        <button class="edit-btn"
            onclick="editRecord('${date}')">
            ✏️
        </button>

        <button class="delete-btn"
            onclick="deleteRecord('${date}')">
            🗑️
        </button>
    </td>
</tr>
`;

    });



    document.getElementById(
        "dailyTotalBottle"
    ).innerText =
    totalBottle;



    document.getElementById(
        "dailyTotalCost"
    ).innerText =
    "₹"+
    (
        totalBottle*bottlePrice
    );


}

// -----------------------------
// Edit
// -----------------------------
function editRecord(date){

    document.getElementById("editDate").value = date;
    document.getElementById("editCount").value = bottleData[date];

    document.getElementById("editModal").style.display="flex";
}

// -----------------------------
// Update
// -----------------------------
function updateRecord(){

    let oldDate = document.getElementById("editDate").value;

    let count = Number(
        document.getElementById("editCount").value
    );

    if(count<=0){
        alert("Invalid bottle count");
        return;
    }

    bottleData[oldDate]=count;

    saveData();

    renderCalendar();

    calculateTotals();

    generateReports();

    closeEditModal();
}

// -----------------------------
// Delete
// -----------------------------
function deleteRecord(date){

    if(!confirm("Delete this record?"))
        return;

    delete bottleData[date];

    saveData();

    renderCalendar();

    calculateTotals();

    generateReports();
}

// -----------------------------
// Close
// -----------------------------

function closeEditModal(){

    document.getElementById("editModal").style.display="none";

}

// -----------------------------
// Monthly Report
// -----------------------------


function generateMonthlyReport(){


    let table =
    document.getElementById(
        "monthlyReport"
    );


    if(!table)
    return;



    table.innerHTML="";


    let months={};



    Object.keys(bottleData)

    .forEach(date=>{


        let d =
        new Date(date);



        let key =
        d.toLocaleString(
            "default",
            {
                month:"long",
                year:"numeric"
            }
        );



        if(!months[key]){

            months[key]=0;

        }



        months[key]
        +=
        bottleData[date];


    });



    let total=0;



    Object.keys(months)

    .forEach(month=>{


        let count =
        months[month];


        total+=count;



        table.innerHTML += `


        <tr>

        <td>
        ${month}
        </td>


        <td>
        ${count}
        </td>


        <td>
        ₹${count*bottlePrice}
        </td>


        </tr>


        `;


    });



    document.getElementById(
        "monthlyTotalBottle"
    ).innerText =
    total;



    document.getElementById(
        "monthlyTotalCost"
    ).innerText =
    "₹"+
    (
        total*bottlePrice
    );


}





// -----------------------------
// Bottle Price Setting
// -----------------------------


function savePrice(){


    let price =
    Number(
        document.getElementById(
            "bottlePrice"
        ).value
    );



    if(price<=0){

        alert(
            "Enter valid price"
        );

        return;

    }



    bottlePrice=price;



    localStorage.setItem(
        "bottlePrice",
        bottlePrice
    );



    calculateTotals();

    generateReports();

    renderCalendar();


    alert(
        "Bottle price updated"
    );


}






// -----------------------------
// Clear All Data
// -----------------------------


function clearAllData(){


    let confirmDelete =
    confirm(
        "Are you sure? All bottle records will be deleted permanently."
    );



    if(confirmDelete){


        bottleData={};


        localStorage.removeItem(
            "bottleData"
        );



        renderCalendar();

        calculateTotals();

        generateReports();


        alert(
            "All data cleared"
        );


    }


}






// -----------------------------
// Edit Records List
// -----------------------------


function openEditList(){


    let dates =
    Object.keys(
        bottleData
    );



    if(dates.length===0){

        alert(
            "No records found"
        );

        return;

    }



    let date =
    prompt(
        "Enter date to edit (YYYY-MM-DD)\n\n"
        +
        dates.join("\n")
    );



    if(
        date &&
        bottleData[date]!==undefined
    ){


        let count =
        prompt(
            "Enter new bottle count",
            bottleData[date]
        );



        if(count!==null){


            bottleData[date]
            =
            Number(count);



            saveData();


            renderCalendar();

            calculateTotals();

            generateReports();


        }


    }


}
/* ==========================================
   script.js Part 3
   Backup, Restore, PDF, Excel Export
   ========================================== */



// -----------------------------
// Backup Data (JSON)
// -----------------------------

function backupData(){


    let backup = {

        bottleData : bottleData,

        bottlePrice : bottlePrice,

        backupDate :
        new Date().toLocaleString()

    };



    let json =
    JSON.stringify(
        backup,
        null,
        2
    );



    let blob =
    new Blob(
        [json],
        {
            type:"application/json"
        }
    );



    let url =
    URL.createObjectURL(blob);



    let a =
    document.createElement("a");



    a.href=url;


    a.download =
    "water_bottle_backup.json";



    a.click();



    URL.revokeObjectURL(url);



    localStorage.setItem(
        "lastBackup",
        new Date().toLocaleString()
    );



    updateBackupInfo();


    alert(
        "Backup created successfully"
    );

}





// -----------------------------
// Restore Data
// -----------------------------


function restoreData(event){


    let file =
    event.target.files[0];


    if(!file)
    return;



    let reader =
    new FileReader();



    reader.onload=function(e){



        let confirmRestore =
        confirm(
        "Restore will replace existing data. Continue?"
        );



        if(!confirmRestore)
        return;



        try{


            let data =
            JSON.parse(
                e.target.result
            );



            bottleData =
            data.bottleData || {};



            bottlePrice =
            data.bottlePrice || 20;



            localStorage.setItem(
                "bottleData",
                JSON.stringify(bottleData)
            );



            localStorage.setItem(
                "bottlePrice",
                bottlePrice
            );



            document.getElementById(
                "bottlePrice"
            ).value =
            bottlePrice;



            renderCalendar();

            calculateTotals();

            generateReports();



            alert(
                "Restore completed"
            );


        }

        catch(error){


            alert(
                "Invalid backup file"
            );


        }


    };



    reader.readAsText(file);


}







// -----------------------------
// Last Backup Display
// -----------------------------


function updateBackupInfo(){


    let last =
    localStorage.getItem(
        "lastBackup"
    );



    let element =
    document.getElementById(
        "lastBackup"
    );



    if(element){


        element.innerText =
        last
        ?
        "Last Backup: "+last
        :
        "Last Backup: Not Available";


    }


}



document.addEventListener(
"DOMContentLoaded",
()=>{

    updateBackupInfo();

});







// -----------------------------
// Export Daily PDF
// -----------------------------


function exportDailyPDF(){


    const {
        jsPDF
    } =
    window.jspdf;



    let pdf =
    new jsPDF();



    pdf.text(
        "Daily Water Bottle Report",
        10,
        15
    );


    let y=30;



    pdf.text(
        "Date        Bottles       Cost",
        10,
        y
    );


    y+=10;



    let total=0;



    Object.keys(bottleData)

    .sort()

    .forEach(date=>{


        let count =
        bottleData[date];


        total += count;



        pdf.text(

        `${date}     ${count}          Rs.${count*bottlePrice}`,

        10,

        y

        );


        y+=8;


    });



    y+=10;


    pdf.text(

    `Grand Total Bottles: ${total}`,

    10,

    y

    );


    y+=8;


    pdf.text(

    `Grand Total Cost: Rs.${total*bottlePrice}`,

    10,

    y

    );


    y+=8;


    pdf.text(

    "Export Date: "+
    new Date().toLocaleString(),

    10,

    y

    );



    pdf.save(
        "daily_report.pdf"
    );


}






// -----------------------------
// Export Monthly PDF
// -----------------------------


function exportMonthlyPDF(){


    const {
        jsPDF
    } =
    window.jspdf;



    let pdf =
    new jsPDF();



    pdf.text(
        "Monthly Water Bottle Report",
        10,
        15
    );


    let y=30;


    let months={};



    Object.keys(bottleData)

    .forEach(date=>{


        let d =
        new Date(date);


        let month =
        d.toLocaleString(
        "default",
        {
        month:"long",
        year:"numeric"
        });



        if(!months[month])
        months[month]=0;



        months[month]
        +=
        bottleData[date];


    });



    pdf.text(
    "Month     Bottles     Cost",
    10,
    y
    );


    y+=10;



    let total=0;



    Object.keys(months)

    .forEach(month=>{


        let count =
        months[month];


        total+=count;



        pdf.text(

        `${month}   ${count}   Rs.${count*bottlePrice}`,

        10,

        y

        );


        y+=8;


    });



    y+=10;



    pdf.text(

    `Overall Bottles: ${total}`,

    10,

    y

    );


    y+=8;


    pdf.text(

    `Overall Cost: Rs.${total*bottlePrice}`,

    10,

    y

    );


    y+=8;


    pdf.text(

    "Export Date: "+
    new Date().toLocaleString(),

    10,

    y

    );



    pdf.save(
        "monthly_report.pdf"
    );


}







// -----------------------------
// Export Daily Excel
// -----------------------------


function exportDailyExcel(){


    let rows=[

        [
        "Date",
        "Bottle Count",
        "Cost"
        ]

    ];



    Object.keys(bottleData)

    .sort()

    .forEach(date=>{


        let count =
        bottleData[date];


        rows.push([

            date,

            count,

            count*bottlePrice

        ]);


    });



    rows.push([]);

    rows.push([

        "Export Date",

        new Date().toLocaleString()

    ]);



    let sheet =
    XLSX.utils.aoa_to_sheet(rows);



    let book =
    XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

        book,

        sheet,

        "Daily Report"

    );



    XLSX.writeFile(

        book,

        "daily_report.xlsx"

    );


}






// -----------------------------
// Export Monthly Excel
// -----------------------------


function exportMonthlyExcel(){


    let rows=[

        [
        "Month",
        "Bottle Count",
        "Cost"
        ]

    ];



    let months={};



    Object.keys(bottleData)

    .forEach(date=>{


        let d =
        new Date(date);



        let month =
        d.toLocaleString(
        "default",
        {
        month:"long",
        year:"numeric"
        });



        if(!months[month])
        months[month]=0;



        months[month]
        +=
        bottleData[date];


    });



    Object.keys(months)

    .forEach(month=>{


        let count =
        months[month];



        rows.push([

            month,

            count,

            count*bottlePrice

        ]);


    });



    rows.push([]);

    rows.push([

        "Export Date",

        new Date().toLocaleString()

    ]);



    let sheet =
    XLSX.utils.aoa_to_sheet(rows);



    let book =
    XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

        book,

        sheet,

        "Monthly Report"

    );



    XLSX.writeFile(

        book,

        "monthly_report.xlsx"

    );


}