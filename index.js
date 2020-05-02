/**
 * @name ScrapingReclameAqui
 * @file index.js
 * @description A intenção desse Scraping é pegar todos os resultados de uma determinada
 * página do Reclame Aqui com seus determinados títulos, conteúdos e metadados. Esse
 * Scraping gerará um JSON como o mesmo localizado no arquivo `example.json`
 * @summary O site do Reclame Aqui, nesta data, foi criado com Angular. Precisamos ter
 * atenção com as classes que nosso Scraper irá pegar, pois elas podem ser variáveis
 * em relação a página que iremos começar a fazer o Scraping.
 * @author Victor Nery <victornery.t@gmail.com>
 * 
 * A página base que utilizamos para esse exemplo: 
 * - https://www.reclameaqui.com.br/empresa/estacio/lista-reclamacoes/?produto=0000000000001136
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const { log } = console;

/**
 * @var CRAWLER_DATA
 * @description Mantém e centraliza as informações do JSON externo gerado e informações de como
 * o mesmo será populado.
 */

const CRAWLER_DATA = {
  title: 'Estácio',
  from: 'Reclame Aqui',
  link: 'https://www.reclameaqui.com.br/empresa/estacio/lista-reclamacoes/?produto=0000000000001136',
  date: new Date().toLocaleDateString('pt-BR'),
};

/**
 * @var OPTIONS
 * @description Organiza e centraliza tudo que obtermos de opções para parametrizações do nosso
 * puppeteer.
 */

const OPTIONS = {
  application: {
    isDebuggerActived: true,
  },
  puppeteer: {
    headless: false,
  },
};

/**
 * Desestruturação realizada para facilitar chamada do
 * `OPTIONS.application.isDebuggerActived` para `isDebuggerActived`
 */

const { application: isDebuggerActived } = OPTIONS

/**
 * @var SCRAPED_DATA
 * @description
 */

 const SCRAPED_DATA = []

/**
 * @function checkFileExists
 * @description Óbvio? Hahaha. Checa se um arquivo existe.
 * @param {*} pathname 
 * @example './filename.json'
 */

const checkFileExists = (pathname) => fs.existsSync(pathname) && true

const createFile = (filename, content = SCRAPED_DATA) => {
  fs.writeFile(`${filename}.json`, ...content, (err) => {
    if(err) throw err;
    console.log('Arquivo criado com sucesso! :-P')
  })
}

const promiseNewPage = new Promise(item => browser.once('targetcreated', target => item(target.page())));

const getDataOfPage = async (page, { order }) => {
  // Esperamos nosso seletor carregar :-) 
  await page.waitForSelector('.complain-list li.ng-scope');

  // Criamos nosso link que será clicado pelo puppeteer
  const link = page.$(`.complain-list li.ng-scope:nth-child(${order}) a`);

  // Clicamos no link criado :-P
  await link.click();

  // Alteramos o target atual
  const newPage = promiseNewPage;

  // Passamos essa mesma página para frente
  newPage.bringToFront();
  await newPage.evaluate(() => {
    const title = document.querySelector('h1.ng-binding');
    const content = document.querySelector('.complain-body p');

    const MOUNTED_DATA = {
      title,
      content
    }

    SCRAPED_DATA.push(MOUNTED_DATA);
  })
}

isDebuggerActived && log('Iniciando aplicação... ');

(async () => {
  const browser = await puppeteer.launch(OPTIONS.puppeteer);
  isDebuggerActived && log('Iniciando Browser');

  const page = await browser.newPage();
  isDebuggerActived && log('Abrindo nova página');
  
  try {
    // Primeiro, vamos começar iniciando a página que gostaríamos
    await page.goto(CRAWLER_DATA.link);
    
    await getDataOfPage(page, 1);

    // Criará um novo arquivo?
    await SCRAPED_DATA && createFile(`${CRAWLER_DATA.title}.json`)

    await browser.close();

  } catch (err) {
    console.error(`Algum problema aconteceu! 😥`, err);
    browser.close();
  }

})(); 