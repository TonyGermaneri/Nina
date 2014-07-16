var fs = require('fs'),
    libDir = __dirname + '/lib',
    styleDir = __dirname + '/lib/style',
    lib = fs.readdirSync(libDir),
    style = fs.readdirSync(styleDir),
    core = fs.readFileSync(libDir + '/core.js'),
    output = ['/*start of core.js*/\n', core, '\n/*end of core.js*/\n'];
lib.forEach(function(file){
    if(file !== 'core.js' && file !== 'style'){
        output.push('/*start of ' + file + '*/\n');
        output.push(fs.readFileSync(libDir + '/' + file ));
        output.push('\n/*end of ' + file +'*/\n');
    }
});
style.forEach(function(file){
    output.push('/*start of style/' + file + '*/\n');
    output.push(fs.readFileSync(styleDir + '/' + file ));
    output.push('\n/*end of style/' + file +'*/\n');
});

if(process.argv[2] !== undefined){
    fs.writeFileSync(process.argv[2], output.join('\n'));
    return;
}
console.log(output.join('\n'));