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
          'Literate':+cols[12],
          'Literaturewithouteducationlevel' : +cols[15] ,
          'BelowPrimary' : +cols[18] ,
          'Primary' : +cols[21] ,
          'Middle' : +cols[24] ,
          'Matric' : +cols[27] ,
          'HrSecIntermediatePreuniversitySeniorsecondary' : +cols[30] ,
          'NonTechnicalDiplamo' : +cols[33] ,
          'TechnicalDiplamo' : +cols[36] ,
          'GraduateandAbove' : +cols[39] ,
          'Unclassified' : +cols[42]
          });
        }
        else{
          eduArray[0]['Literate'] =eduArray[0]['Literate'] + +cols[12];
          eduArray[0]['Literaturewithouteducationlevel'] =eduArray[0]['Literaturewithouteducationlevel'] + +cols[15];
          eduArray[0]['BelowPrimary'] =eduArray[0]['BelowPrimary'] + +cols[18];
          eduArray[0]['Primary'] =eduArray[0]['Primary'] + +cols[21];
          eduArray[0]['Middle'] =eduArray[0]['Middle'] + +cols[24];
          eduArray[0]['Matric'] =eduArray[0]['Matric'] + +cols[27];
          eduArray[0]['HrSecIntermediatePreuniversitySeniorsecondary'] =eduArray[0]['HrSecIntermediatePreuniversitySeniorsecondary'] + +cols[30];
          eduArray[0]['NonTechnicalDiplamo'] =eduArray[0]['NonTechnicalDiplamo'] + +cols[33];
          eduArray[0]['TechnicalDiplamo'] =eduArray[0]['TechnicalDiplamo'] +  +cols[36];
          eduArray[0]['GraduateandAbove'] =eduArray[0]['GraduateandAbove'] + +cols[39];
          eduArray[0]['Unclassified'] = eduArray[0]['Unclassified'] + +cols[42];

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
