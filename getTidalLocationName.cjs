// https://opendata.cwa.gov.tw/opendatadoc/MMC/A0021-001.pdf

const fs = require('fs')
const PDFParser = require('pdf2json')

const pdfParser = new PDFParser(this, 1)

pdfParser.on('pdfParser_dataError', (errData) => console.error(errData.parserError))
pdfParser.on('pdfParser_dataReady', (pdfData) => {
  const txt = pdfParser.getRawTextContent()
  const tableTitle = txt.match(/[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+/g)
  const tableContent = txt.match(/.{4,} \d{3}\.\d{1,5}\ (?:\d{2}\.\d{1,5}|\d{2})/g)
  const tableToObject = (title, content) => {
    const titles = title[0].split(' ')

    const rs = content.map((row) => {
      const values = row.split(' ')
      const obj = values.reduce((acc, value, index) => {
        acc[titles[index]] = value
        return acc
      }, {})
      return obj
    })

    return rs
  }
  const json = {
    data: tableToObject(tableTitle, tableContent),
  }

  fs.writeFile('src/doc/A0021-001.json', JSON.stringify(json), () => {
    console.log('Done.')
  })
})

pdfParser.loadPDF('src/doc/A0021-001.pdf')
