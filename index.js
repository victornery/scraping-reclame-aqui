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

const { application: isDebuggerActived } = OPTIONS

isDebuggerActived && log('Iniciando aplicação... ');

(async () => {
  const browser = await puppeteer.launch(OPTIONS.puppeteer);
  isDebuggerActived && log('Iniciando Browser');

  const page = await browser.newPage();
  isDebuggerActived && log('Abrindo nova página');
  
  try {
    await page.goto(CRAWLER_DATA.link);
    // browser.close();
  } catch (err) {
    console.error(`Algum problema aconteceu! 😥`, err);
    browser.close();
  }

})();

// const title = document.querySelector('h1.ng-binding');
// const content = document.querySelector('.complain-body p');