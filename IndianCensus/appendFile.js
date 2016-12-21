var fs=require('fs');

function ReadAppend(file,appendFile){
  fs.readFile(appendFile,function(err,data){
    if(err)throw err;
    console.log('File was Read');

    fs.appendFile(file,data,function(err){
      if(err)throw err;
      console.log('The "data to append" was appended to a file');
      });
    });
}

file='./csv/combained.csv';
appendFile='./csv/general.csv';
ReadAppend(file,appendFile);

appendFile='./csv/sc.csv';
ReadAppend(file,appendFile);

appendFile='./csv/st.csv';
ReadAppend(file,appendFile);
