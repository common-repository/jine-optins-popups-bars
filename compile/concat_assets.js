var concat = require('concatenate-files');

var adminDev = require('../admin-interface/loader/admin_dev.json')
var clientDev = require('../client/loader/client_dev.json')

catAndSave(adminDev, '../admin-interface', 'scripts', '../admin-interface/dist/admin.min.js', 'js')
catAndSave(adminDev, '../admin-interface', 'styles', '../admin-interface/dist/admin.min.css', 'css')
catAndSave(clientDev, '../client', 'scripts', '../client/dist/client.min.js', 'js')
catAndSave(clientDev, '../client', 'styles', '../client/dist/client.min.css', 'css')

function catAndSave(json, base, key, saveAs, extension) {
    var files = []
    for (var i in json[key]) {
        var set = json[key][i]
        var path = base + set.base

        for (var item_i in set.items) {
            var item = set.items[item_i]

            if (set.suffix) {
                files.push(path + '/' + set.items[item_i] + set.suffix + '.' + extension)
            } else {
                files.push(path + '/' + set.items[item_i] + '.' + extension)
            }

        }

    }

    concat(files, saveAs,{separator:'\n'}, function(err, result) {
        if (err) {
            console.log('error while saving')
            console.log(err)
        } else {
            console.log('saved ' + saveAs)
        }

    });
}