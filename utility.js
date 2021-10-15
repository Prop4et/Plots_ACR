var biChoiceIndex = [2, 11, 15, 21];
var multipleChoiceIndex = [8, 9, 13, 14, 19, 20, 22, 26]
function init(){
    var choice = document.getElementById("plots");
    for(i=0; i<plots.length; i++){
        var opt = document.createElement('option');
        opt.innerHTML = plots[i];
        opt.value = i;
        i == 0 ? opt.selected="selected" : "";
        choice.appendChild(opt);
    }
    var maybe = document.getElementById("maybe");
    maybe.hidden = true;
    var openAnswer = document.getElementById("openAnswer");
    openAnswer.hidden = true;
}



//gets called anytime a value for a plot is passed
//starting with yes/no which is easier to create, then i can start thinking about the others
function passValue(value){
    var element = document.getElementById("plots");
    var index = element.value;
    if(!charts.get(index)){
        createDiv(index);
        if(value === 0){
            dataVal.set(index, [1,0]);
            backgroundColors.set(index, ["#ff0000", "#00ff00"])
        }else if(value === 1){
            dataVal.set(index, [0,1]);
            backgroundColors.set(index, ["#ff0000", "#00ff00"])
        }else if(value === 2){
            dataVal.set(index, [0,0,1]);
            backgroundColors.set(index, ["#ff0000", "#00ff00", "#0b15a3"])
        }
    }else{
        dataVal.get(index)[value]++;
    }
    draw(index);
}

//draws the plot
function draw(index){
    var ctx = document.getElementById(index).getContext('2d');
    var data = [{
        data: dataVal.get(index),
        labels: [document.getElementById("noName").innerHTML, document.getElementById("yesName").innerHTML],
        backgroundColor: backgroundColors.get(index),
        borderColor: "#fff"
    }];
    
    

    var options = {
    tooltips: {
    enabled: false
    },
        plugins: {
        datalabels: {
            formatter: (value, ctx) => {
            
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
                sum += data;
            });
            let percentage = (value*100 / sum).toFixed(2)+"%";
            return percentage;     
            },
            color: '#000',
                }
        }
    };

    if(charts.get(index)) 
        charts.get(index).destroy(); 
        
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: data
        },
            options: options
        });
    
        
    
    charts.set(index, myChart);
    

    
}

//gets called when the index inside the select changes, it helps to determine the type of input for the plot
//(basically changes yes/no into a text box or a multiple choice if needed)

function createDiv(index){
    var div = document.getElementById("big-container");
    var innerDiv = document.createElement('div');
    innerDiv.innerHTML = "<h3>"+plots[index]+"</h3>";
    innerDiv.className = "chart-container";
    innerDiv.id = "div"+String(index);
    innerDiv.style="position:relative; float: left; 23em; 23em; padding-bottom : 2em; padding-right:2em";
    
    var chartCanvas = document.createElement('canvas');
    chartCanvas.style = "display:block; box-sizing: border-box; height:300px; width:300px;";
    chartCanvas.id = String(index); 
    
    innerDiv.appendChild(chartCanvas);
    div.appendChild(innerDiv);
}

function changeOpt(){
    var element = document.getElementById("plots");
    var index = element.value;
    switch(index){
        case '11':
            biOpt("caff&eacute", "coca-cola")
        break;
        case '15':
            biOpt("pesca", "limone")
        break;
        case '21':
            biOpt("Estate", "Inverno")
        break;
        case '2':
            triOpt("Verdi", "Neri", "Azzurri")
        break;
        case '8':case '9':case '13':case '14':case '19':case '20':case '22':case '26':
            open();
        break;
        default:
            reset();
        break;
    }
}
function biOpt(s1, s2){
    reset();
    var yes = document.getElementById("yesName");
    yes.innerHTML = s1;
    var no = document.getElementById("noName");
    no.innerHTML = s2;

}

function reset(){
    var yes = document.getElementById("yes");
    var no = document.getElementById("no");
    yes.hidden = false;
    no.hidden = false;
    var yes = document.getElementById("yesName");
    yes.innerHTML = "Sì";
    var no = document.getElementById("noName");
    no.innerHTML = "No";
    var maybe = document.getElementById("maybe");
    maybe.hidden = true;
    var openAnswer = document.getElementById("openAnswer");
    openAnswer.hidden = true;
}

function triOpt(s1, s2, s3){
    reset();
    var yes = document.getElementById("yesName");
    yes.innerHTML = s1;
    var no = document.getElementById("noName");
    no.innerHTML = s2;
    var maybeName = document.getElementById("maybeName")
    maybeName.innerHTML = s3;
    var maybe = document.getElementById("maybe");
    maybe.hidden = false;
}

function open(){
    var yes = document.getElementById("yes");
    var no = document.getElementById("no");
    var maybe = document.getElementById("maybe");
    yes.hidden = true;
    no.hidden = true;
    maybe.hidden = true;
    var openAnswer = document.getElementById("openAnswer");
    openAnswer.hidden = false;    
}

function destroyDiv(index){
    var elem = document.getElementById("div"+String(index));
    elem.parentNode.removeChild(elem);
}

function del(){
    var element = document.getElementById("plots");
    var index = element.value;
    if(!charts.get(index))
        return;
    charts.get(index).destroy();
    charts.delete(index);
    dataLabels.delete(index);
    dataVal.delete(index);
    destroyDiv(index);
    
}

function send(){
    var element = document.getElementById("plots");
    var index = element.value;
    var input = document.getElementById('openLabel');
    if(!dataLabels.get(index))
        dataLabels.set(index, []);

    if(!dataVal.get(index))
        dataVal.set(index, new Map());

    
    //if value in then i should add counter
    if(dataLabels.get(index).includes(input.value)){
        var inc = dataVal.get(index).get(input.value);
        inc++;
        dataVal.get(index).set(input.value, inc);
    }
    else{
        dataLabels.get(index).push(input.value);      
        dataVal.get(index).set(input.value,1);
    }
    var map = dataVal.get(index);
    //input.value è il valore nella text box
    const data = {
        labels: dataLabels.get(index),
        datasets: [{
            axis: 'y',
            label: 'Risposte',
            data: Array.from(map.values()),
            fill: false,
            backgroundColor: [
            'rgba(132, 3, 252, 0.2)',
            ],
            borderColor: [
            'rgb(132, 3, 252)',
            ],
            borderWidth: 1
        }]
    };
    if(!charts.get(index))
        createDiv(index);
    else 
        charts.get(index).destroy();
    var ctx = document.getElementById(index).getContext('2d');


    var myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    stacked: false
                }
            }
        }
    });
    charts.set(index, myChart);
}