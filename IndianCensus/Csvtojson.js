//required modules
var fileSystem = require('fs');
var stream = require('stream');
var readLine = require('readline');

//input and output stream
var inputStream = fileSystem.createReadStream('csv/combained.csv');
var outputStream = new stream;


var obj = readLine.createInterface(inputStream, outputStream);

//array object creation
var ageArray = [];
var graArray = [];
var eduArray = [];

var jsonObj = {};

function isPresent(age) {
    var index = null;
    for (var i = 0; i < ageArray.length; i++) {
        if (age == ageArray[i]['agegroup']) {
            index = i;
            break;
        }
    }
    return index;
}

function findIndexGrad(state) {
    state = state.substr(8, (state.length - 1));
    var index = null;
    for (var i = 0; i < graArray.length; i++) {
        if (state == graArray[i]['State']) {
            index = i;
            break;
        }
    }
    return index;
}
obj.on('line', function(line) {
    var jsonObj = {};
    var cols = line.split(',');

    if (cols[3] === 'INDIA' && cols[4] === 'Total') {
        jsonObj['agegroup'] = cols[5];
        jsonObj['population'] = +cols[12];

        var age = isPresent(cols[5]);

        if (age != null) {
            var result = ageArray[age];
            result['population'] += jsonObj['population'];
            ageArray[age] = result;
        } else {
            ageArray.push(jsonObj);
        }
    }
});

obj.on('line', function(line) {
    var jsonObj = {};
    var cols = line.split(',');

    if (cols[3] != 'INDIA' && cols[4] === 'Total' && cols[5] == 'All ages') {
        var state = cols[3];
        state = state.substr(8, (state.length - 1));

        jsonObj['State'] = state;
        jsonObj['Total Graduate'] = +cols[39];
        jsonObj['Total male'] = +cols[40];
        jsonObj['Total female'] = +cols[41];

        var index = findIndexGrad(cols[3]);
        if (index != null) {
            var result = graArray[index];
            result['Total Graduate'] += jsonObj['Total Graduate'];
            result['Total male'] += jsonObj['Total male'];
            result['Total female'] += jsonObj['Total female'];
            graArray[index]=result;
        } else {
            graArray.push(jsonObj);
        }
    }
});

obj.on('line', function(line) {
    var jsonObj = {};
    var cols = line.split(',');

    if (cols[3] === 'INDIA' && cols[4] === 'Total' && cols[5] === 'All ages') {
        if(eduArray.length===0){
            eduArray.push({
              'eduCat': 'Literate',
              'totPop': +cols[12]
            });
            eduArray.push({
              'eduCat': 'Literaturewithouteducationlevel',
              'totPop': +cols[15]
            });
            eduArray.push({
              'eduCat': 'BelowPrimary',
              'totPop': +cols[18]
            });
            eduArray.push({
              'eduCat': 'Primary',
              'totPop': +cols[21]
            });
            eduArray.push({
              'eduCat': 'Middle',
              'totPop': +cols[24]
            });
            eduArray.push({
              'eduCat': 'Matric',
              'totPop': +cols[27]
            });
            eduArray.push({
              'eduCat': 'HrSecIntermediatePreuniversitySeniorsecondary',
              'totPop': +cols[30]
            });
            eduArray.push({
              'eduCat': 'NonTechnicalDiplamo',
              'totPop': +cols[33]
            });
            eduArray.push({
              'eduCat': 'TechnicalDiplamo',
              'totPop': +cols[36]
            });
            eduArray.push({
              'eduCat': 'GraduateandAbove',
              'totPop': +cols[39]
            });
            eduArray.push({
              'eduCat': 'Unclassified',
              'totPop': +cols[42]
            });
        }
        else{
          eduArray[0]['totPop'] =eduArray[0]['totPop'] + +cols[12];
          eduArray[1]['totPop'] =eduArray[1]['totPop'] + +cols[15];
          eduArray[2]['totPop'] =eduArray[2]['totPop'] + +cols[18];
          eduArray[3]['totPop'] =eduArray[3]['totPop'] + +cols[21];
          eduArray[4]['totPop'] =eduArray[4]['totPop'] + +cols[24];
          eduArray[5]['totPop'] =eduArray[5]['totPop'] + +cols[27];
          eduArray[6]['totPop'] =eduArray[6]['totPop'] + +cols[30];
          eduArray[7]['totPop'] =eduArray[7]['totPop'] + +cols[33];
          eduArray[8]['totPop'] =eduArray[8]['totPop'] +  +cols[36];
          eduArray[9]['totPop'] =eduArray[9]['totPop'] +  +cols[39];
          eduArray[10]['totPop'] = eduArray[10]['totPop'] + +cols[42];

        }
    }
});

//writing it on the JSON file
obj.on('close', function() {
    fileSystem.writeFile('json/query1.json', JSON.stringify(ageArray, null, 2), 'utf8', function(error) {
        if (error) {
            console.log(error);
        }
    });
});
obj.on('close', function() {
    fileSystem.writeFile('json/query2.json', JSON.stringify(graArray, null, 2), 'utf8', function(error) {
        if (error) {
            console.log(error);
        }
    });
});
obj.on('close', function() {
    fileSystem.writeFile('json/query3.json', JSON.stringify(eduArray, null, 2), 'utf8', function(error) {
        if (error) {
            console.log(error);
        }
    });
});
