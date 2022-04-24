window.addEventListener("load", showTime());//Get clock on load

var selector = document.getElementById("stationSelect");//Get select element from page

var selectorValue = selector.value;//Get station value from selector

var trainResult = document.getElementById("trainTable");//Get the table element for displaying results

var currentStation = document.querySelector("h2");//Get the h2 element from the document

var stations = {//List for referencing train station abbreviations
    "HKI": "Helsinki", "PSL": "Pasila", "ILA": "Ilmala",
    "HPL": "Huopalahti", "VMO": "Valimo", "PJM": "Pitäjänmäki", "MÄK": "Mäkkylä",
    "LPV": "Leppävaara", "KIL": "Kilo", "KEA": "Kera", "KNI": "Kauniainen", "KVH": "Koivuhovi",
    "TRL": "Tuomarila", "EPO": "Espoo", "KLH": "Kauklahti", "MAS": "Masala",
    "JRS": "Jorvas", "TOL": "Tolsa", "KKN": "Kirkkonummi", "KE": "Kerava", "LH": "Lahti",
    "KV": "Kouvola", "RI": "Riihimäki", "HL": "Hämeenlinna", "STI": "Siuntio",
    "KÄP": "Käpylä", "OLK": "Oulunkylä", "PMK": "Pukinmäki", "ML": "Malmi", "TNA": "Tapanila",
    "PLA": "Puistola", "HKH": "Hiekkaharju", "KVY": "Koivukylä", "RKL": "Rekola",
    "KRS": "Korso", "SAV": "Savio", "KE": "Kerava", "AIN": "Ainola", "JP": "Järvenpää",
    "SAU": "Saunakallio", "JK": "Jokela", "HY": "Hyvinkää", "KÄP": "Käpylä",
    "OLK": "Oulunkylä", "PMK": "Pukinmäki", "ML": "Malmi", "TNA": "Tapanila", "PLA": "Puistola",
    "TKL": "Tikkurila", "LNÄ": "Leinelä", "LEN": "Helsinki Airport", "AVP": "Aviapolis",
    "KTÖ": "Kivistö", "VEH": "Vehkala", "VKS": "Vantaankoski", "MRL": "Martinlaakso", "LOH": "Louhela",
    "MYR": "Myyrmäki", "MLO": "Malminkartano", "KAN": "Kannelmäki", "POH": "Pohjois-Haaga",
    "HPL": "Huopalahti", "ILA": "Ilmala", "TPE": "Tampere"
};

var lineP = ["PSL", "ILA", "HPL", "POH", "KAN", "MLO", "MYR", "LOH", "MRL", "VKS", "VEH", "KTÖ", "AVP"];

var lineI = ["KÄP", "OLK", "PMK", "ML", "TNA", "PLA", "TKL", "HKH", "LNÄ"];

var stationsZ; //Variable for finding the abbreviation - station name pair

var resultTable = "<table>"; //Make a table with JS

function showTime() { //Get time and show it in a readable form
    "use strict"; //use strict mode
    const today = new Date(); //get a new date
    var h = today.getHours(); //get hours from current time and pass it into a let
    var m = today.getMinutes();//get minutes from current time and pass it into a let
    var s = today.getSeconds();//same but for seconds
    if (m < 10) {  //Add a 0 to current time for the "current time" clock for minutes. If the current time is below 10 (for example: 10:9 will be displayed as 10:09).
        m = "0" + m;
    }
    if (h < 10) { //same as above but for hours
        h = "0" + h;
    }
    if (s < 10) { //for seconds
        s = "0" + s;
    }

    document.getElementById("timer").innerHTML = "Current time:" + " " +//display current time on the HTML page
        h + ":" + m + ":" + s;
    setTimeout(showTime, 1000);//timeout timer for the clock, after this time in seconds it will stop
}



document.getElementById("returnTrains").addEventListener("click", getTrainData); //Add an event listener to the "Get train data" button to eventually show results in a table

function getValue() { //gets the selector value for train station value
    selectorValue = selector.value;
}

function getTrainData() { //The main function for the app's functionality: the function that will make the XMLHttpRequest, filter the resulting data and display it in a table
    selectorValue = selector.value;//get selector value

    currentStation.innerHTML = "Train departure times for the " + stations[selectorValue] + " train station";//Show which station the data table is for

    trainTable.innerHTML =//make the table headers for the HTML table to display train data
        "<th>" + "Line ID" + "</th>" +
        "<th>" + "Time of departure" + "</th>" +
        "<th>" + "Destination" + "</th>";


    var xhr = new XMLHttpRequest(); //create a variable for xmlhttprequest
    xhr.onreadystatechange = function () { //when state changes, call the function
        if (this.readyState == 4 && this.status == 200) { //if readystate is 4 (done) and status == 200 (ok), then proceed
            var response = JSON.parse(xhr.responseText); //parse the response text into JSON
            var output = []; //create an empty array

            for (i = 0; i < response.length; i++) { //for loop
                var rows = response[i].timeTableRows; //result pre-filtering
                for (g = 0; g < rows.length; g++) { //for loop inside another for loop(nested for loop)
                    if (rows[g].stationShortCode == selectorValue && rows[g].type == "DEPARTURE") { //get only departing train data from the results

                        var last = (rows[(rows.length - 1)]); //get the last element from rows

                        var tmp = { //temporary data that will be added to output
                            "trainNumber": response[i].trainNumber, "commuterLine": response[i].commuterLineID,
                            "Time": rows[g].scheduledTime, "shortCode": last.stationShortCode
                        };
                        var datum = new Date() //get a new date
                        var str = datum.toISOString().slice(0, -5) //transform the date into ISO format

                        if (tmp.Time < str) { //if the train has already departed according to schedule, remove it from the data
                            break;
                        }
                        if (tmp.shortCode == selectorValue || lineP.includes(selectorValue) && response[i].commuterLineID == "P") { //If the train is departing from HKI and the destination is HKI according to Digitraffic data, then the real destination is the airport train station
                            tmp.shortCode = "Airport";//The or statement is for making the line p train destination to read as airport if you're in the stations before it
                        }
                        else if (lineI.includes(selectorValue) && response[i].commuterLineID == "I") {//same as above but for line i trains
                            tmp.shortCode = "Airport";
                        }
                        output.push(tmp);//add the temporary data to data for outputting it later
                    }
                }
            }

            output.sort((a, b) => (a.Time > b.Time) ? 1 : -1); //sort the output data by time in ascending order: the train departing the soonest will show as the first item in the list
            for (h = 0; h < output.length; h++) {//for loop according to output length to loop through each item

                var datez = new Date(output[h].Time);//get a regular date from the ISO format
                let hours = datez.getHours();//get hours from ISO
                let minutes = datez.getMinutes();//minutes
                if (minutes < 10) {//add 0 if minutes is under 10 (10:9 -> 10:09)
                    minutes = "0" + minutes;
                }

                if (stations[output[h].shortCode] != undefined) {//If the station is in the list, change the abbreviation into a name (LPV -> Leppävaara)
                    stationZ = stations[output[h].shortCode];
                }
                else {
                    stationZ = output[h].shortCode;//if the station is not in the list, show the abbreviation instead of undefined
                }

                trainResult.innerHTML += "<tr><td> " + output[h].commuterLine + "</td><td>" +//display the data in a table: the for loop iterates each item in the list according to list length and add the filtered data in the table
                    hours + ":" + minutes + "</td><td>" + stationZ + "</td></tr>";
            }
        }
    }
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1//live-trains/station/" + selectorValue + "?departing_trains=100&include_nonstopping=false&train_categories=Commuter", true);//details for the "GET" request and the url for requesting data in asynchronous mode to get data from Digitraffic
    xhr.send();//send the request to the server to receive data
}

