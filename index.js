const fs = require('fs');
const http = require('http');
const url = require('url');

const replacePlaceholders = require('./modules/replacePlaceholders');


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,`utf-8`);
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req,res)=>{

    const {query,pathname} = url.parse(req.url,true);
    // overview page
    if(pathname==='/' || pathname === '/overview')
    {
        res.writeHead(200,{'Content-Type': 'text/html'});

        const cardsHtml = dataObj.map( el => replacePlaceholders(tempCard,el));
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g,cardsHtml);
        res.end(output);
    }

    // product page
    else if(pathname === '/product')
    {
        res.writeHead(200,{'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replacePlaceholders(tempProduct,product);
        res.end(output);
    }

    // api
    else if(pathname === '/api')
    {
        res.writeHead(200,{ 'Content-Type': 'application/json'});
        res.end(data);
    }

    // not found
    else
    {
        res.writeHead(404,{ 'Content-Type': 'text/html'})
        res.end('<h1>Page Not Found!</h1>');
    }
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("listening on port 8000");
});