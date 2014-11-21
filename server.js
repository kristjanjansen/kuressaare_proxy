
var path = require('path')

var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')

var app = express()

app.get('/www.osiliana.ee/:page', function (req, res) {

  request({url: 'http://www.osiliana.ee/' + req.params.page, encoding: 'binary'}, function (e, r, b) {
       if (!e && r.statusCode == 200) {
         // b = iconv.decode(b, 'iso-8859-1'
         var $ = cheerio.load(b);
         var contents = $('#sisu').html()
            res.jsonp(parse(contents))
         }
     });

})

app.listen(5000)


function parse(contents) {

  var output = {}
  var image_base = 'http://www.osiliana.ee/Pildid'

  var images = contents.match(/href="javascript:suurpilt\((.*?)\);"/g)
  
  if (images) {
  
    output.images = []
    
    images.forEach(function(image) { 
      image = path.basename(image.split(',')[1]).split('&')[0]                 
      output.images.push(image_base + '/' + image)    
    })
  }

  output.desc = contents
    .replace(/<a\b[^>]*>/ig,'<strong>')
    .replace(/<\/a>/ig, '</strong>')
    .replace(/\n\n<\/p>/g,'</p>\n')
    .replace(/<h1>/g,'<h4>')
    .replace(/<\/h1>/g,'</h4>')
    .replace(/<h4>Krundi ajalugu<\/h4>/g, '')
             
  return output

}