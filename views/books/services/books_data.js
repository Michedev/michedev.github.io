var app = angular.module('app')

app.service('BooksReaden', function(){
    return [
        {
            id: 0,
            name: "Umano, troppo umano",
            author: 'Friedrich Nietzsche',
            link_img: 'views/books/static/img/umano_troppo_umano.jpg',
            buy_link: 'https://www.amazon.it/Umano-troppo-umano-Friedrich-Nietzsche/dp/8845903907/ref=sr_1_1?ie=UTF8&qid=1518039138&sr=8-1&keywords=umano+troppo+umano&dpID=41uYlWRXzoL&preST=_SY264_BO1,204,203,200_QL40_&dpSrc=srch',
        },
        {
            id: 1,
            name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            link_img: 'views/books/static/img/clean_code.jpg',
            buy_link: 'https://www.amazon.it/Clean-Code-Handbook-Craftsmanship-Paperback/dp/B00M0OPFIQ/ref=sr_1_3?s=books&ie=UTF8&qid=1518039353&sr=1-3&keywords=clean+code&dpID=41urnS8m9lL&preST=_SX198_BO1,204,203,200_QL40_&dpSrc=srch'
        }
    ]
})