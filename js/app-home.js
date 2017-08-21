var app = angular.module('app', ['ngRoute']);
//variables for RMP calculations in parametersController
var ssA0=0,ssB0=0,ssC0=0,ssD0=0,ssD1=0,ssE0=0,ssE1=0,ssE2=0;
var lsA0=8,lsB0=8,lsC0=8,lsD0=8,lsD1=8,lsE0=8,lsE1=8,lsE2=8;
var ltA0=120,ltB0=120,ltC0=120,ltD0=120,ltD1=120,ltE0=120,ltE1=120,ltE2=120;
//variables for KANBAN calculations in parameterController
var kbA0=2, kbB0=2, kbC0=2, kbD0=2, kbD1=2, kbE0=2, kbE1=2, kbE2=2;
var kblsA0=2, kblsB0=2, kblsC0=2, kblsD0=2, kblsD1=2, kblsE0=2, kblsE1=2, kblsE2=2;
//variables for CONWIP calculations in parameterController
var wipcap=15, workahead=90;

var planningParameter = "MRP";
var homeInterval; //interval from homecontroller
var IPAdress = "91.219.68.208";
var inventory_M1;
var inventory_M2;
var inventory_M3;
var inventory_M4;
var inventory_M5;

var inventory_A0;
var inventory_B0;
var inventory_C0;
var inventory_D0;
var inventory_D1;
var inventory_E0;
var inventory_E1;
var inventory_E2;

var fix_inventory_E0;
var fix_inventory_E1;
var fix_inventory_E2;

var wip_inventory;
var fgi_inventory;
var inventory; //sum of the wip and the fgi

var wip_array;
var fgi_array;
var inv_array;

var averageWip;
var averageFgi;
var averageInv;
var totalWip;
var totalFgi;
var totalInventory; //sum of the inventory of everysecond to calculate the avg inventory
var CO;

var service;
var serviceLevel;
var lastservicelevel //the last servicelevel of the game to push to the db after the game has stopped
var totalOrders; 

var resetvariables = function(){
    CO = [[1, 191, 2], [0, 214, 1], [0, 227, 1], [1, 242, 2], [2, 282, 1], [0, 313, 1], [1, 314, 2], [1, 337, 2], [0, 349, 1], [1, 363, 2], [0, 390, 1], [0,    435, 1], [1, 443, 2], [0, 452, 1], [1, 476, 2], [1, 496, 2], [0, 533, 1], [1, 567, 2], [0, 569, 1], [1, 602, 2], [0, 624, 1], [2, 630, 1], [1, 632, 2], [0, 641, 1], [1, 712, 2], [0, 715, 1], [1, 729, 2], [2, 765, 1], [0, 792, 1], [1, 794, 2], [1, 815, 2], [0, 826, 1], [1, 838, 2], [0, 862, 1], [0, 903, 1], [1, 910, 2], [0, 919, 1], [1, 942, 2], [1, 963, 2], [0, 1000, 1], [1, 1034, 2], [0, 1036, 1], [1, 1070, 2], [0, 1092, 1], [2, 1098, 1], [1, 1099, 2], [0, 1109, 1], [1, 1154, 2], [0, 1158, 1], [1, 1193, 2], [0, 1216, 1], [0, 1229, 1], [1, 1244, 2], [2, 1284, 1], [0, 1315, 1], [1, 1316, 2], [1, 1339, 2], [0, 1351, 1], [1, 1365, 2], [0, 1392, 1], [0, 1437, 1], [1, 1445, 2], [0, 1454, 1], [1, 1478, 2], [1, 1498, 2], [0, 1535, 1], [1, 1569, 2], [0, 1571, 1], [1, 1604, 2], [0, 1626, 1], [2, 1632, 1], [1, 1632, 2], [0, 1643, 1], [1, 1714, 2], [0, 1717, 1], [1, 1731, 2], [2, 1767, 1], [0, 1794, 1], [1, 1796, 2], [1, 1817, 2], [0, 1828, 1], [1, 1840, 2], [0, 1864, 1], [0, 1905, 1], [1, 1912, 2], [0, 1921, 1], [1, 1944, 2], [1, 1965, 2], [0, 2002, 1], [1, 2036, 2], [0, 2038, 1], [1, 2072, 2], [0, 2094, 1], [2, 2100, 1], [1, 2101, 2], [0, 2111, 1], [1, 2156, 2]];
    inventory_M1 = [];
    inventory_M2 = [];
    inventory_M3 = [];
    inventory_M4 = [];
    inventory_M5 = [];

    inventory_A0 = [];
    inventory_B0 = [];
    inventory_C0 = [];
    inventory_D0 = [];
    inventory_D1 = [];
    inventory_E0 = [];
    inventory_E1 = [];
    inventory_E2 = [];
    
    fix_inventory_E0;
    fix_inventory_E1;
    fix_inventory_E2;
    
    wip_inventory = 0;
    fgi_inventory = 0;
    inventory = 0;
    
    totalWip = 0;
    totalFgi = 0;
    totalInventory = 0;
    
    wip_array = [];
    fgi_array = [];
    inv_array = [];
    
    time_M1 = 0;
    time_M2 = 0;
    time_M3 = 0;
    time_M4 = 0;
    time_M5 = 0;
    
    service = 0;
    serviceLevel = [];
    lastservicelevel = 0;
    totalOrders = 0;
}

app.config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'loginController'
        })
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'homeController'
        })
        .when('/playgame', {
            templateUrl: 'play.html',
            controller: 'playgameController'
        })
        .when('/parameters', {
            templateUrl: 'parameters.html',
            controller: 'parameterController'
        })
        .when('/analyse', {
            templateUrl: 'analyse.html',
            controller: 'analyseController'
        })
        .when('/instructions', {
            templateUrl: 'in1.html',
            controller: 'instructionsController'
        })
        .when('/contact', {
            templateUrl: 'contact.html',
            controller: 'contactController'
        })
        .when('/in1', {
            templateUrl: 'in1.html',
        })
        .when('/in2', {
            templateUrl: 'in2.html',
        })
        .when('/in3', {
            templateUrl: 'in3.html',
        })
        .when('/in4', {
            templateUrl: 'in4.html',
        })
        .when('/in5', {
            templateUrl: 'in5.html',
        });
        
        //.otherwise({ redirectTo: '/login.html' });
});

app.controller('loginController', function ($scope, $http, $location) {
    var login = document.getElementById('login').className = "visible";
    var navbar = document.getElementById('myNavbar');
    $scope.signin = function () {
        var status = document.getElementById("loginSucces")
        var successCallback = function (response) {
            if (response.data == "*Approved*") {
                //notifaction because redirect doesn't work
                window.location.href = "index.html#/home";
            } else if (response.data == "*Denied*"){
                status.innerHTML = "Login failed! Please try again"
                status.className = "alert alert-danger"
            }

        }
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        var data = {
            "username": $scope.signinEmail,
            "password": $scope.signinPassword
        }

        $http.post('http://'+IPAdress+'/websignin', data).then(successCallback, errorCallback);


    }

});

app.controller('homeController', function($scope, $interval){
    var login = document.getElementById('login').className = "hidden"; //hide login on the other pages
    var navbar = document.getElementById('myNavbar').className = "collapse navbar-collapse"; //show navbar when you refresh
    $interval.cancel(homeInterval);
    
});

app.controller('playgameController', function ($scope, $http, $location, $interval,$window) {
    var login = document.getElementById('login').className = "hidden"; //hide login on the other pages
    var navbar = document.getElementById('myNavbar').className = "collapse navbar-collapse"; //show navbar when you refresh
    var startstop = 'stop'; //set the game on stop
    var prevStateM1 = "idle";
    var prevStateM2 = "idle";
    var prevStateM3 = "idle";
    var prevStateM4 = "idle";
    var prevStateM5 = "idle";
    var startTime = 0; //start time of the game in ms
    var currentTime = 0; //current time of the game in ms
    $scope.t3 = 0; //current time - start time to get the time of the game
    var minutes = 0; //minutes of the time
    var seconds = 0; //seconds of the time
    //$scope.inventory;
    var prevTime = 0; //variable to check if the game is running or not
    $scope.orders1 = [];
    $scope.orders2 = [];
    $scope.orders3 = [];
    $scope.orders4 = [];
    $scope.orders5 = [];
    //variables for calculating the leadtime
    var tot_leadtime = 0; //total seconds of products in production
    var leadtime = 0; //total seconds of products in production devided by the amount of products produced
    var leadtime_counter = 0; //counter for the amount of products finished
    
    var tot_overall_leadtime = 0; //total seconds of products in the inventory
    var overall_leadtime = 0; //total seconds of products in the inventory devided by products taken
    var overall_leadtime_counter=0; //counter of the amount of products taken by customers
    
    var fgi_leadtime = 0; //overall_leadtime - leadtime
    
    //variables for the processing time
    var time_M1 = 0; timeM1_start = 0; timeM1_stop = 0; producedPieces_M1 = 0;
    var time_M2 = 0; timeM2_start = 0; timeM2_stop = 0; producedPieces_M2 = 0;
    var time_M3 = 0; timeM3_start = 0; timeM3_stop = 0; producedPieces_M3 = 0;
    var time_M4 = 0; timeM4_start = 0; timeM4_stop = 0; producedPieces_M4 = 0;
    var time_M5 = 0; timeM5_start = 0; timeM5_stop = 0; producedPieces_M5 = 0;
    
    //variables and functions for d3 graphs
    var graph_height = 300;
    var graph_width = 600;
    var graph_margin = {left:25,right:25,top:50,bottom:0};

    var yScaleInventory = d3.scaleLinear()
                .domain([0,100])
                .range([graph_height,0]);
    var yScaleServiceLevel = d3.scaleLinear()
                .domain([0,100])
                .range([graph_height,0]);
    var xScale = d3.scaleLinear()
                .domain([0,1000])
                .range([0,graph_width]);

    var yAxisInventory = d3.axisLeft(yScaleInventory).ticks(5);
    var yAxisServiceLevel = d3.axisLeft(yScaleServiceLevel).ticks(5);
    var xAxis = d3.axisBottom(xScale);

    var lineInventory = d3.line()
                    .x(function(d,i){ return xScale(i); })
                    .y(function(d,i){ return yScaleInventory(d); });
    var lineServiceLevel = d3.line()
                    .x(function(d,i){ return xScale(i); })
                    .y(function(d,i){ return yScaleServiceLevel(d); });
    
    var str_pad_left = function(string, pad, length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    }
    
    var updateCharts = function() {
        //update Inventory Graph
        var chartGroup1 = d3.select("#chart1").transition();  
        chartGroup1.select(".line1")
            .duration(800)
            .attr("d", lineInventory(wip_array));
        chartGroup1.select(".line2")
            .duration(800)
            .attr("d", lineInventory(fgi_array));
        chartGroup1.select(".line3")
            .duration(800)
            .attr("d", lineInventory(inv_array)); 
        //update Service Level Graph
        var chartGroup2 = d3.select("#chart2").transition();
        chartGroup2.select(".line4")
            .duration(800)
            .attr("d", lineServiceLevel(serviceLevel));
    }
    
    var pushinventory = function(){
        //http post for the inventory
        var successCallbackInventory = function (response) { }
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        var data = {
            "A0":inventory_A0.length,
            "B0":inventory_B0.length,
            "C0":inventory_C0.length,
            "D0":inventory_D0.length,
            "D1":inventory_D1.length,
            "E0":inventory_E0.length,
            "E1":inventory_E1.length,
            "E2":inventory_E2.length
        }
        $http.post('http://'+IPAdress+'/makeinventory', data).then(successCallbackInventory, errorCallback);
    }
    
    var init = function(){
        resetvariables();
        //Make Inventory Graph
        var chart1 = d3.select("#chart1").append("svg").attr("height",(graph_height+graph_margin.top+25)).attr("width","100%");
        var chartGroup1 = chart1.append("g").attr("transform","translate("+graph_margin.left+","+graph_margin.top+")");
        //the wip line
        chartGroup1.append("path")
            .attr("class", "line1")
            .attr("stroke", "blue")
            .attr("fill", "none")
            .attr("d",lineInventory(wip_array));
        //the fgi line
        chartGroup1.append("path")
            .attr("class", "line2")
            .attr("stroke", "green")
            .attr("fill", "none")
            .attr("d",lineInventory(fgi_array));
        //the inv line
        chartGroup1.append("path")
            .attr("class", "line3")
            .attr("stroke", "red")
            .attr("fill", "none")
            .attr("d",lineInventory(inv_array));
        //the yAxis
        chartGroup1  .append("g") 
                        .attr("fill", "none")
                        .attr("class", "axis y")
                        .attr("text-anchor", "end")
                        .call(yAxisInventory)
                    .append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "0.71em")
                        .attr("text-anchor", "end")
                        .text("Amount (pcs)");
        //the xAxis
        chartGroup1  .append("g")
                        .attr("fill", "none")
                        .attr("class","axis x")
                        .attr("transform","translate(0,"+graph_height+")")
                        .attr("text-anchor", "end")
                        .call(xAxis)
                    .append("text")
                        .attr("fill", "#000")
                        .attr("x", graph_width)
                        .attr("transform","translate(0,-5)")
                        .attr("text-anchor", "end")
                        .text("Time (sec)");
        //the title
        chartGroup1.append("text")
            .attr("x", (graph_width / 2))
            .attr("y", 0 - (graph_margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Inventory");

        //Make Service Level Graph
        var chart2 = d3.select("#chart2").append("svg").attr("height",(graph_height+graph_margin.top+25)).attr("width","100%");
        var chartGroup2 = chart2.append("g").attr("transform","translate("+graph_margin.left+","+graph_margin.top+")");
        //the service level line
        chartGroup2.append("path")
            .attr("class", "line4")
            .attr("stroke", "blue")
            .attr("fill", "none")
            .attr("d",lineServiceLevel(serviceLevel));
        //the yAxis
        chartGroup2  .append("g") 
                        .attr("fill", "none")
                        .attr("class", "axis y")
                        .attr("text-anchor", "end")
                        .call(yAxisServiceLevel)
                    .append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "0.71em")
                        .attr("text-anchor", "end")
                        .text("Service Level (%)");
        //the xAxis
        chartGroup2  .append("g")
                        .attr("fill", "none")
                        .attr("class","axis x")
                        .attr("transform","translate(0,"+graph_height+")")
                        .attr("text-anchor", "end")
                        .call(xAxis)
                    .append("text")
                        .attr("fill", "#000")
                        .attr("x", graph_width)
                        .attr("transform","translate(0,-5)")
                        .attr("text-anchor", "end")
                        .text("Time (sec)");
        //the title
        chartGroup2.append("text")
            .attr("x", (graph_width / 2))
            .attr("y", 0 - (graph_margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Service Level");
        
        $scope.planningparameter = planningParameter;
        if(planningParameter == "MRP"){
            document.getElementById('radioMRP').checked = true;
            document.getElementById('radioKANBAN').checked = false;
            document.getElementById('radioCONWIP').checked = false;
        }else 
        if(planningParameter == "KANBAN"){
            document.getElementById('radioMRP').checked = false;
            document.getElementById('radioKANBAN').checked = true;
            document.getElementById('radioCONWIP').checked = false;
        }else
        if(planningParameter == "CONWIP"){
            document.getElementById('radioMRP').checked = false;
            document.getElementById('radioKANBAN').checked = false;
            document.getElementById('radioCONWIP').checked = true;
        }
            
        var successCallbackOrder = function (response) {
            $scope.orderlist = response.data;
        }
        var successCallbackStartStop = function (response) {
            startstop = 'stop';
        }
        
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        
        $http.get('http://'+IPAdress+'/getorderlist').then(successCallbackOrder, errorCallback);
        $scope.finalTime = "00:00";
        var data = {
            "startstop": "stop",
            "parameter": "null"
        }
        $http.post('http://'+IPAdress+'/webstartstop', data).then(successCallbackStartStop, errorCallback);
    }
    init();
    
    //1 second interval function
    homeInterval = $interval(function (){
        planningParameter = $scope.planningparameter;
        $scope.test = inv_array;
        //update the 3 charts with 3 functions
        updateCharts();
        var successCallbackInventory = function (response) { }
        //get the status from every machine with a post-req
        var successCallbackStats = function (response) {
            $scope.stats = response.data;
        }
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        $http.get('http://'+IPAdress+'/getstats').then(successCallbackStats, errorCallback);
        //start the gametime
        if (startstop == 'start') {
            currentTime = performance.now();
            $scope.t3 = Math.round((currentTime - startTime) / 1000);
            minutes = Math.floor($scope.t3 / 60);
            seconds = $scope.t3 % 60;
            $scope.finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
        } 
        else if (startstop == 'change'){
            $scope.t3 = 0;
        }
        
        //push orders in orderslists when time is equal
        for (i = 0; i < $scope.orderlist.length; i++) {
            if ($scope.t3 == $scope.orderlist[i].time) {
                switch($scope.orderlist[i].machine){
                    case "machine1":
                            $scope.orders1.push($scope.orderlist[i]);
                            break;
                    case "machine2":
                            $scope.orders2.push($scope.orderlist[i]);
                            break;
                    case "machine3":
                            $scope.orders3.push($scope.orderlist[i]);
                            break;
                    case "machine4":
                            $scope.orders4.push($scope.orderlist[i]);
                            break;
                    case "machine5":
                            $scope.orders5.push($scope.orderlist[i]);
                            break;
                }  
            }
        }
        
        //machine1
        if($scope.stats[0].machine == "machine1"){
            var currentState = $scope.stats[0].status;
            //Positive flank --> from idle to working
            if(currentState=="working" && prevStateM1 == "idle"){
                timeM1_start = performance.now();
                for(var i = 0; i < $scope.orders1[0].amount; i++){
                    inventory_M1.push($scope.t3);
                }
            }
            //Negative flank --> from working to idle
            if(currentState=="idle" && prevStateM1 == "working"){
                timeM1_stop = performance.now();
                time_M1 += (timeM1_stop - timeM1_start)/1000;
                producedPieces_M1 += $scope.orders1[0].amount;
                for(var i = 0; i < $scope.orders1[0].amount; i++){
                    inventory_A0.push(inventory_M1[0])
                    inventory_M1.shift();
                }
                if($scope.orders1.length > 0)
                {
                    $scope.orders1.shift();
                }
                pushinventory();
            }
            prevStateM1 = $scope.stats[0].status;
            //change the colors of the machines
            var machine = document.getElementById("mach1");
            if (currentState == "idle"){
                machine.style.backgroundColor = "#00BFFF";
            }
            if(currentState == "idle" && $scope.orders1.length > 0){
                machine.style.backgroundColor =  "#FF0000";
            }
            if(currentState == "working"){
                machine.style.backgroundColor =  "#32CD32";
            }
            if(currentState == "non-active"){
                machine.style.backgroundColor = "whitesmoke";
            }
            
        }
        //machine2
        if($scope.stats[1].machine == "machine2"){
            var currentState = $scope.stats[1].status;
            //Positive flank --> from idle to working
            if(currentState=="working" && prevStateM2 == "idle"){
                timeM2_start = performance.now();
                for(var i = 0; i < $scope.orders2[0].amount; i++){
                    if(inventory_A0[0] == "0"){
                        inventory_M2.push($scope.t3);
                        inventory_A0.shift();

                    }else{
                        inventory_M2.push(inventory_A0[0]);
                        inventory_A0.shift();
                    }
                }
            }
            //Negative flank --> from working to idle
            if(currentState=="idle" && prevStateM2 == "working"){
                timeM2_stop = performance.now();
                time_M2 += (timeM2_stop - timeM2_start)/1000;
                
                producedPieces_M2 += $scope.orders2[0].amount;
                for(var i = 0; i < $scope.orders2[0].amount; i++){
                    inventory_B0.push(inventory_M2[0])
                    inventory_M2.shift();
                }
                if($scope.orders2.length > 0)
                {
                    $scope.orders2.shift();
                }
                pushinventory();
            }
            prevStateM2 = $scope.stats[1].status;
            //change the colors of the machines
            var machine = document.getElementById("mach2");
            if (currentState == "idle"){
                machine.style.backgroundColor = "#00BFFF";
            }
            if(currentState == "idle" && $scope.orders2.length > 0){
                machine.style.backgroundColor =  "#FF0000";
            }
            if(currentState == "working"){
                machine.style.backgroundColor =  "#32CD32";
            }
            if(currentState == "non-active"){
                machine.style.backgroundColor = "whitesmoke";
            }
        }
        //machine3
        if($scope.stats[2].machine == "machine3"){
            var currentState = $scope.stats[2].status;
            //Positive flank --> from idle to working
            if(currentState=="working" && prevStateM3 == "idle"){
                timeM3_start = performance.now();
                for(var i = 0; i < $scope.orders3[0].amount; i++){
                    if(inventory_B0[0] == "0"){
                        inventory_M3.push($scope.t3);
                        inventory_B0.shift();

                    }else{
                        inventory_M3.push(inventory_B0[0]);
                        inventory_B0.shift();
                    }
                    
                }
            }
            //Negative flank --> from working to idle
            if(currentState=="idle" && prevStateM3 == "working"){
                timeM3_stop = performance.now();
                time_M3 += (timeM3_stop - timeM3_start)/1000;
                producedPieces_M3 += $scope.orders3[0].amount;
                for(var i = 0; i < $scope.orders3[0].amount; i++){
                    inventory_C0.push(inventory_M3[0])
                    inventory_M3.shift();
                }
                if($scope.orders3.length > 0)
                {
                    $scope.orders3.shift();
                }
                pushinventory();
            }
            prevStateM3 = $scope.stats[2].status;
            //change the colors of the machines
            var machine = document.getElementById("mach3");
            if (currentState == "idle"){
                machine.style.backgroundColor = "#00BFFF";
            }
            if(currentState == "idle" && $scope.orders3.length > 0){
                machine.style.backgroundColor =  "#FF0000";
            }
            if(currentState == "working"){
                machine.style.backgroundColor =  "#32CD32";
            }
            if(currentState == "non-active"){
                machine.style.backgroundColor = "whitesmoke";
            }
        }
        //machine4
        if($scope.stats[3].machine == "machine4"){
            var currentState = $scope.stats[3].status;
            //Positive flank--> from idle to working
            if(currentState=="working" && prevStateM4 == "idle"){
                timeM4_start = performance.now();
                for(var i = 0; i < $scope.orders4[0].amount; i++){
                    if(inventory_C0[0] == "0"){
                        inventory_M4.push($scope.t3);
                        inventory_C0.shift();

                    }else{
                        inventory_M4.push(inventory_C0[0]);
                        inventory_C0.shift();
                    }
                }
            }
            //Negative flank --> from working to idle
            if(currentState=="idle" && prevStateM4 == "working"){
                timeM4_stop = performance.now();
                time_M4 += (timeM4_stop - timeM4_start)/1000;
                producedPieces_M4 += $scope.orders4[0].amount;
                for(var i = 0; i < $scope.orders4[0].amount; i++){
                    if($scope.orders4[0].product == "D0"){
                        inventory_D0.push(inventory_M4[0])
                        inventory_M4.shift();
                    }
                    if($scope.orders4[0].product == "D1"){
                        inventory_D1.push(inventory_M4[0])
                        inventory_M4.shift();
                    }
                }
                if($scope.orders4.length > 0)
                {
                    $scope.orders4.shift();
                }
                pushinventory();
            }
            prevStateM4 = $scope.stats[3].status;
            //change the colors of the machines
            var machine = document.getElementById("mach4");
            if (currentState == "idle"){
                machine.style.backgroundColor = "#00BFFF";
            }
            if(currentState == "idle" && $scope.orders4.length > 0){
                machine.style.backgroundColor =  "#FF0000";
            }
            if(currentState == "working"){
                machine.style.backgroundColor =  "#32CD32";
            }
            if(currentState == "non-active"){
                machine.style.backgroundColor = "whitesmoke";
            }
        }
        //machine5
        if($scope.stats[4].machine == "machine5"){
            var currentState = $scope.stats[4].status;
            //Positive flank --> from idle to working
            if(currentState=="working" && prevStateM5 == "idle"){
                timeM5_start = performance.now();
                for(var i = 0; i < $scope.orders5[0].amount; i++){
                    if($scope.orders5[0].product == "E0" || $scope.orders5[0].product == "E1"){
                        if(inventory_D0[0] == "0"){
                            inventory_M5.push($scope.t3);
                            inventory_D0.shift();

                        }else{
                            inventory_M5.push(inventory_D0[0]);
                            inventory_D0.shift();
                        }
                    }
                    if($scope.orders5[0].product == "E2"){
                        if(inventory_D1[0] == "0"){
                            inventory_M5.push($scope.t3);
                            inventory_D1.shift();

                        }else{
                            inventory_M5.push(inventory_D1[0]);
                            inventory_D1.shift();
                        }
                    }
                }
            }
            //Negative flank --> from working to idle
            if(currentState=="idle" && prevStateM5 == "working"){
                timeM5_stop = performance.now();
                time_M5 += (timeM5_stop - timeM5_start)/1000;
                producedPieces_M5 += $scope.orders5[0].amount;
                for(var i = 0; i < $scope.orders5[0].amount; i++){
                    //calculating leadtime
                    leadtime_counter++;
                    tot_leadtime += $scope.t3 - inventory_M5[0];
                    leadtime = tot_leadtime/leadtime_counter;
                    
                    if($scope.orders5[0].product == "E0"){
                        inventory_E0.push(inventory_M5[0]);
                        inventory_M5.shift();
                    }
                    if($scope.orders5[0].product == "E1"){
                        inventory_E1.push(inventory_M5[0]);
                        inventory_M5.shift();
                    }
                    if($scope.orders5[0].product == "E2"){
                        inventory_E2.push(inventory_M5[0]);
                        inventory_M5.shift();
                    } 
                }
                if($scope.orders5.length > 0)
                {
                    $scope.orders5.shift();
                }
                pushinventory();
            }
            prevStateM5 = $scope.stats[4].status;  
            //change the colors of the machines
            var machine = document.getElementById("mach5");
            if(currentState == "idle"){
                machine.style.backgroundColor = "#00BFFF";
            }
            if(currentState == "idle" && $scope.orders5.length > 0){
                machine.style.backgroundColor =  "#FF0000";
            }
            if(currentState == "working"){
                machine.style.backgroundColor =  "#32CD32";
            }
            if(currentState == "non-active"){
                machine.style.backgroundColor = "whitesmoke";
            }
        }
        
        //Inventory calculations
        //wip_inventory = inventory_A0.length + inventory_B0.length + inventory_C0.length + inventory_D0.length + inventory_D1.length + inventory_M1.length + inventory_M2.length + inventory_M3.length + inventory_M4.length + inventory_M5.length;
        
        fgi_inventory = inventory_E0.length + inventory_E1.length + inventory_E2.length;
        inventory = wip_inventory + fgi_inventory;
        
        if($scope.t3 != prevTime){
            wip_array.push(wip_inventory);
            fgi_array.push(fgi_inventory);
            inv_array.push(inventory);
            //push service level every second for graph
            serviceLevel.push(parseInt(lastservicelevel.toFixed(2)*100));
            $scope.serviceLevel = serviceLevel;
            //console.log(wip_array);
            totalWip += wip_inventory;
            totalFgi += fgi_inventory;
            totalInventory += inventory;
            averageWip = totalWip/wip_array.length;
            averageFgi = totalFgi/fgi_array.length;
            averageInv = totalInventory/inv_array.length;
        }
        
        prevTime = $scope.t3;
        
        //console.log(""+averageInventory+"   "+totalInventory);
        //console.log("M1: "+inventory_M1+"\nA0: "+inventory_A0+"\nM2: "+inventory_M2+"\nB0: "+inventory_B0+"\nM3: "+inventory_M3+"\nC0: "+inventory_C0+"\nM4: "+inventory_M4+"\nD0: "+inventory_D0+"\nD1: "+inventory_D1+"\nM5: "+inventory_M5+"\nE0: "+inventory_E0+"\nE1: "+inventory_E1+"\nE2: "+inventory_E2+"\nWIP: "+wip_inventory+"\nFGI: "+fgi_inventory+"\nInv: "+inventory);
        
        //calculating service level & leadtime
        if(CO[0][1] == $scope.t3){
            switch(CO[0][0]){
                case 0:
                    if(inventory_E0.length >= CO[0][2]){
                        tot_overall_leadtime += $scope.t3 - inventory_E0[0]; //calculate total overall leadtime
                        service++;
                        for(var i = 0; i<CO[0][2]; i++){
                            inventory_E0.shift();
                        }
                    }else{
                        fix_inventory_E0 += CO[0][2];
                    }
                    break;
                case 1:
                    if(inventory_E1.length >= CO[0][2]){
                        tot_overall_leadtime += $scope.t3 - inventory_E1[0]; //calculate total overall leadtime
                        service++;
                        for(var i = 0; i<CO[0][2]; i++){
                            inventory_E1.shift();
                        }
                    }else{
                        fix_inventory_E1 += CO[0][2];
                    }
                    break;
                case 2:

                    if(inventory_E2.length >= CO[0][2]){
                        tot_overall_leadtime += $scope.t3 - inventory_E2[0]; //calculate total overall leadtime
                        service++;
                        for(var i = 0; i < CO[0][2]; i++){
                            inventory_E2.shift();
                        }
                    }else{
                        fix_inventory_E2 += CO[0][2];
                    }
                    break;
            }
            
            totalOrders++;
            CO.shift();
            lastservicelevel = service/totalOrders;
            //calculate overall leadtime
            overall_leadtime_counter++;
            overall_leadtime = tot_overall_leadtime/overall_leadtime_counter;
        }
        //if an order is to late you need to delete it afterwards
        if(inventory_E0.length >= fix_inventory_E0){
            for(var i = 0; i < fix_inventory_E0; i++){
                inventory_E0.shift();
            }
            pushinventory();
        }
        if(inventory_E1.length >= fix_inventory_E1){
            for(var i = 0; i < fix_inventory_E1; i++){
                inventory_E1.shift();
            }
            pushinventory();
        }
        if(inventory_E2.length >= fix_inventory_E2){
            for(var i = 0; i < fix_inventory_E2; i++){
                inventory_E2.shift();
            }
            pushinventory();
        }
        
        fgi_leadtime = leadtime - overall_leadtime;
    }, 1000);
    
    //function for creating a session
    $scope.createSession = function () {
        resetvariables();
        
        var saveButton1 = document.getElementById("savebutton1").className = "hidden";
        var saveButton2 = document.getElementById("savebutton2").className = "hidden";
        var saveInput = document.getElementById("saveinput").className = "hidden";
        
        var successCallback = function (response) {
            $scope.orders1 = [];
            $scope.orders2 = [];
            $scope.orders3 = [];
            $scope.orders4 = [];
            $scope.orders5 = [];
            startstop = "change";
        }
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        var data = {
            "startstop": "create"
        }
        $http.post('http://'+IPAdress+'/webstartstop', data).then(successCallback, errorCallback);
        $scope.finalTime = "00:00";
        $scope.sessionName = '';
    }

    //function for starting a session
    $scope.start = function () {
        resetvariables(); //set costumerorders, as I delete them during the game, and other variables back to basic
        
        //hide buttons and input for save the session
        var saveButton1 = document.getElementById("savebutton1").className = "hidden";
        var saveButton2 = document.getElementById("savebutton2").className = "hidden";
        var saveInput = document.getElementById("saveinput").className = "hidden";
        
        //POST REQUEST FOR STARTSTOP
        var webstartstop = function(){
            var data = {
                "startstop": "start",
                "parameter": planningParameter
            }
            $http.post('http://'+IPAdress+'/webstartstop', data).then(successCallbackStartStop, errorCallback);       
        }
        
        //ERROR-CALLBACK
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        
        //SUCCES-CALLBACKS
        var successCallbackOrder = function (response) {
            $scope.orderlist = response.data;
        }
        var successCallbackStartStop = function (response) {
            startTime = performance.now();
            startstop = 'start';
        }
        var successCallbackProducts = function (res) {
            alert("Initial inventory: \n"+"\nA0: "+res.data.A0+"\nB0: "+res.data.B0+"\nC0: "+res.data.C0+
                          "\nD0: "+res.data.D0+"\nD1: "+res.data.D1+"\nE0: "+res.data.E0+"\nE1: "+res.data.E1+
                          "\nE2: "+res.data.E2);
            webstartstop();
            //placed getorderlist request here otherwise it gets the older orderlist because it was not pushed yet
            $http.get('http://'+IPAdress+'/getorderlist').then(successCallbackOrder, errorCallback); 
            for(var i = 0; i < res.data.A0; i++){
                inventory_A0.push(0);
            }
            for(var i = 0; i < res.data.B0; i++){
                inventory_B0.push(0);
            }
            for(var i = 0; i < res.data.C0; i++){
                inventory_C0.push(0);
            }
            for(var i = 0; i < res.data.D0; i++){
                inventory_D0.push(0);
            }
            for(var i = 0; i < res.data.D1; i++){
                inventory_D1.push(0);
            }
            for(var i = 0; i < res.data.E0; i++){
                inventory_E0.push(0);
            }
            for(var i = 0; i < res.data.E1; i++){
                inventory_E1.push(0);
            }
            for(var i = 0; i < res.data.E2; i++){
                inventory_E2.push(0);
            }
        }
        
        //DATA FOR MAKEPRODUCTORDERS
        switch($scope.planningparameter){
            case 'MRP':
                $scope.parametersArray = "[["+ssE0+","+lsE0+","+ltE0+"],["+ssE1+","+lsE1+","+ltE1+"],["+ssE2+","+lsE2+","+ltE2+"],["+ssD0+","+lsD0+","+ltD0+"],["+ssD1+","+lsD1+","+ltD1+"],["+ssC0+","+lsC0+","+ltC0+"],["+ssB0+","+lsB0+","+ltB0+"],["+ssA0+","+lsA0+","+ltA0+"]]";
                var data = $scope.parametersArray;
                $http.post('http://'+IPAdress+'/makeproductorders', data).then(successCallbackProducts, errorCallback);
                break;
            case 'KANBAN':
                $http.get('http://'+IPAdress+'/getcostreq').then(successCallbackOrder, errorCallback);
                alert("Initial inventory: \n"+
                              "\nA0: "+kbA0+"x"+kblsA0+
                              "\nB0: "+kbB0+"x"+kblsB0+
                              "\nC0: "+kbC0+"x"+kblsC0+
                              "\nD0: "+kbD0+"x"+kblsD0+
                              "\nD1: "+kbD1+"x"+kblsD1+
                              "\nE0: "+kbE0+"x"+kblsE0+
                              "\nE1: "+kbE1+"x"+kblsE1+
                              "\nE2: "+kbE2+"x"+kblsE2);
                webstartstop();
                break;
            case 'CONWIP':
                $http.get('http://'+IPAdress+'/getcostreq').then(successCallbackOrder, errorCallback);
                alert("Initial inventory: \n"+
                              "\nWipcap: "+wipcap+
                              "\nWork Ahead Window: "+workahead);
                webstartstop();
                break;
        }
    }

    //function for stoping a session
    $scope.stop = function () {
        var saveButton1 = document.getElementById("savebutton1").className = "btn btn-info";
        var saveButton2 = document.getElementById("savebutton2").className = "btn btn-info";
        var saveInput = document.getElementById("saveinput").className = "visible";
        var successCallback = function (response) {
            startstop = 'stop';
        }
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        var data = {
            "startstop": "stop",
            "parameter": "null"
        }

        $http.post('http://'+IPAdress+'/webstartstop', data).then(successCallback, errorCallback);
    }
    
    $scope.parameters = function () {
        window.location.href='index.html#/parameters';
    }
    
    $scope.savesession = function(){ 
        var successCallback = function (response) {
            console.log("saved succesfully");
        }
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        var data = {
            "sessionName":$scope.sessionName,
            "planningAlgoritm":planningParameter,
            "MRPparameters":[ssA0,ssB0,ssC0,ssD0,ssD1,ssE0,ssE1,ssE2,lsA0,lsB0,lsC0,lsD0,lsD1,lsE0,lsE1,lsE2,ltA0,ltB0,ltC0,ltD0,ltD1,ltE0,ltE1,ltE2],
            "KANBANparameters":[kbA0,kbB0,kbC0,kbD0,kbD1,kbE0,kbE1,kbE2,kblsA0,kblsB0,kblsC0,kblsD0,kblsD1,kblsE0,kblsE1,kblsE2],
            "CONWIPparameters":[wipcap,workahead],
            "averageWip":averageWip,
            "averageFgi":averageFgi,
            "averageInv":averageInv,
            "serviceLevel":lastservicelevel,
            "leadtime":leadtime,
            "total_time":$scope.t3,
            "utilisation_M1":Math.round((time_M1/$scope.t3)*100),
            "utilisation_M2":Math.round((time_M2/$scope.t3)*100),
            "utilisation_M3":Math.round((time_M3/$scope.t3)*100),
            "utilisation_M4":Math.round((time_M4/$scope.t3)*100),
            "utilisation_M5":Math.round((time_M5/$scope.t3)*100),
            "average_utilisation":(time_M1/$scope.t3 + time_M2/$scope.t3 + time_M3/$scope.t3 + time_M4/$scope.t3 + time_M5/$scope.t3)/5,
            "timePerPiece_M1":time_M1/producedPieces_M1,
            "timePerPiece_M2":time_M2/producedPieces_M2,
            "timePerPiece_M3":time_M3/producedPieces_M3,
            "timePerPiece_M4":time_M4/producedPieces_M4,
            "timePerPiece_M5":time_M5/producedPieces_M5,
            "timePerPiece": (time_M1/producedPieces_M1 + time_M2/producedPieces_M2 + time_M3/producedPieces_M3 + time_M4/producedPieces_M4+ time_M5/producedPieces_M5)
        }
        
        if($scope.sessionName == null){
            alert("Please enter a session name");
        }else{
            $http.post('http://'+IPAdress+'/websavesession', data).then(successCallback, errorCallback);
            var saveButton1 = document.getElementById("savebutton1").className = "hidden";
            var saveButton2 = document.getElementById("savebutton2").className = "hidden";
            var saveInput = document.getElementById("saveinput").className = "hidden";
        }
        
    }
});

app.controller('parameterController', function ($scope, $interval) {
    
    //stop the interval function of the homecontroller
    $interval.cancel(homeInterval);
    var login = document.getElementById('login').className = "hidden"; //hide login on the other pages
    var navbar = document.getElementById('myNavbar').className = "collapse navbar-collapse"; //show navbar when you refresh
    
    
    var MRPtable = document.getElementById('mrpTable');
    var KANBANtable = document.getElementById('kanbanTable');
    var CONWIPtable = document.getElementById('conwipTable');
    
     //set default parameters
    $scope.saftystock_A0 = ssA0;
    $scope.saftystock_B0 = ssB0;
    $scope.saftystock_C0 = ssC0;
    $scope.saftystock_D0 = ssD0;
    $scope.saftystock_D1 = ssD1;
    $scope.saftystock_E0 = ssE0;
    $scope.saftystock_E1 = ssE1;
    $scope.saftystock_E2 = ssE2;

    $scope.lostsize_A0 = lsA0;
    $scope.lostsize_B0 = lsB0;
    $scope.lostsize_C0 = lsC0;
    $scope.lostsize_D0 = lsD0;
    $scope.lostsize_D1 = lsD1;
    $scope.lostsize_E0 = lsE0;
    $scope.lostsize_E1 = lsE1;
    $scope.lostsize_E2 = lsE2;

    $scope.leadtime_A0 = ltA0;
    $scope.leadtime_B0 = ltB0;
    $scope.leadtime_C0 = ltC0;
    $scope.leadtime_D0 = ltD0;
    $scope.leadtime_D1 = ltD1;
    $scope.leadtime_E0 = ltE0;
    $scope.leadtime_E1 = ltE1;
    $scope.leadtime_E2 = ltE2;
    
    $scope.kanban_A0 = kbA0;
    $scope.kanban_B0 = kbB0;
    $scope.kanban_C0 = kbC0;
    $scope.kanban_D0 = kbD0;
    $scope.kanban_D1 = kbD1;
    $scope.kanban_E0 = kbE0;
    $scope.kanban_E1 = kbE1;
    $scope.kanban_E2 = kbE2;
    
    $scope.kanbonlotsize_A0 = kblsA0;
    $scope.kanbonlotsize_B0 = kblsB0;
    $scope.kanbonlotsize_C0 = kblsC0;
    $scope.kanbonlotsize_D0 = kblsD0;
    $scope.kanbonlotsize_D1 = kblsD1;
    $scope.kanbonlotsize_E0 = kblsE0;
    $scope.kanbonlotsize_E1 = kblsE1;
    $scope.kanbonlotsize_E2 = kblsE2;
    
    $scope.wipcap = wipcap;
    $scope.workahead = workahead;
    
    
    if(planningParameter == "MRP"){
        MRPtable.className = "table table-hover";
        KANBANtable.className = "hidden";
        CONWIPtable.className = "hidden";
    }
    if(planningParameter == "KANBAN"){
        MRPtable.className = "hidden";
        KANBANtable.className = "table table-hover";
        CONWIPtable.className = "hidden";
    }
    if(planningParameter == "CONWIP"){
        MRPtable.className = "hidden";
        KANBANtable.className = "hidden";
        CONWIPtable.className = "table table-hover";
    }

    $scope.saveParameters = function(){
        if(planningParameter == 'MRP'){
            ssA0 = $scope.saftystock_A0;
            ssB0 = $scope.saftystock_B0;
            ssC0 = $scope.saftystock_C0;
            ssD0 = $scope.saftystock_D0;
            ssD1 = $scope.saftystock_D1;
            ssE0 = $scope.saftystock_E0;
            ssE1 = $scope.saftystock_E1;
            ssE2 = $scope.saftystock_E2;

            lsA0 = $scope.lostsize_A0;
            lsB0 = $scope.lostsize_B0;
            lsC0 = $scope.lostsize_C0;
            lsD0 = $scope.lostsize_D0;
            lsD1 = $scope.lostsize_D1;
            lsE0 = $scope.lostsize_E0;
            lsE1 = $scope.lostsize_E1;
            lsE2 = $scope.lostsize_E2;

            ltA0 = $scope.leadtime_A0;
            ltB0 = $scope.leadtime_B0;
            ltC0 = $scope.leadtime_C0;
            ltD0 = $scope.leadtime_D0;
            ltD1 = $scope.leadtime_D1;
            ltE0 = $scope.leadtime_E0;
            ltE1 = $scope.leadtime_E1;
            ltE2 = $scope.leadtime_E2;
        }
        else if(planningParameter == 'KANBAN'){
            kbA0 = $scope.kanban_A0;
            kbB0 = $scope.kanban_B0;
            kbC0 = $scope.kanban_C0;
            kbD0 = $scope.kanban_D0;
            kbD1 = $scope.kanban_D1;
            kbE0 = $scope.kanban_E0;
            kbE1 = $scope.kanban_E1;
            kbE2 = $scope.kanban_E2;
            
            kblsA0  = $scope.kanbonlotsize_A0;
            kblsB0  = $scope.kanbonlotsize_B0;
            kblsC0  = $scope.kanbonlotsize_C0;
            kblsD0  = $scope.kanbonlotsize_D0;
            kblsD1  = $scope.kanbonlotsize_D1;
            kblsE0  = $scope.kanbonlotsize_E0;
            kblsE1  = $scope.kanbonlotsize_E1;
            kblsE2  = $scope.kanbonlotsize_E2;
        }
        else if(planningParameter == 'CONWIP'){
            wipcap = $scope.wipcap;
            workahead = $scope.workahead;
        }
        $scope.submitted = "Parameters saved!";
    }  
});

app.controller('analyseController', function ($scope, $interval, $http) {
    //stop the interval function of the homecontroller
    $interval.cancel(homeInterval);
    //hide the login on all pages
    var login = document.getElementById('login').className = "hidden"; //hide login on the other pages
    var navbar = document.getElementById('myNavbar').className = "collapse navbar-collapse"; //show navbar when you refresh
    
    $scope.data;
    var successCallbackGet = function (response) {
        $scope.data = response.data;
    }
    var errorCallback = function (response) {
        console.log("error")
        alert.call(response);
    }
    
    $http.get('http://'+IPAdress+'/getsessions').then(successCallbackGet, errorCallback);
    
    var successCallbackPost = function (response) { }
    var errorCallback = function (response) {
        console.log("error")
        alert.call(response);
    }
    $scope.deleteSession = function(sessionNumber){
        var data =  {number:sessionNumber};
        $http.post('http://'+IPAdress+'/webdeletesession', data).then(successCallbackPost, errorCallback);
    }
    
    $scope.col1 = false;
    $scope.col2 = false;
    $scope.col3 = false;
    $scope.col4 = false;
    $scope.col5 = false;
    $scope.col6 = false;
    $scope.col7 = false;
    $scope.col8 = false;
    $scope.col9 = false;
    $scope.col10 = false;
});

app.controller('instructionsController', function($scope, $interval){
    $interval.cancel(homeInterval);
    var login = document.getElementById('login').className = "hidden"; //hide login on the other pages
    var navbar = document.getElementById('myNavbar').className = "collapse navbar-collapse"; //show navbar when you refresh
    
});

app.controller('contactController', function($scope, $interval){
    $interval.cancel(homeInterval);
    var login = document.getElementById('login').className = "hidden"; //hide login on the other pages
    var navbar = document.getElementById('myNavbar').className = "collapse navbar-collapse"; //show navbar when you refresh
});