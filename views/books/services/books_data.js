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
        },
        {
            id: 2,
            name: 'Test-Driven Development: By Example',
            author: 'Kent Beck',
            link_img: 'views/books/static/img/tdd_by_examples.jpg',
            buy_link: 'https://books.google.it/books?id=CUlsAQAAQBAJ&printsec=frontcover&dq=test+driven+development+by+example&hl=it&sa=X&ved=0ahUKEwjs3vW2-qDZAhUK6RQKHYSyARwQ6AEIKzAA#v=onepage&q=test%20driven%20development%20by%20example&f=false'
        },
    ]
})

app.service('BooksToFinish', function(){
    return [
        {
            id: 0,
            name: " Python Machine Learning: Unlock Deeper Insights into Machine Learning With This Vital Guide to Cutting-edge Predictive Analytics",
            author: 'Sebastian Raschka',
            link_img: 'views/books/static/img/python_ml.jpg',
            buy_link: 'https://books.google.it/books?id=GOVOCwAAQBAJ&printsec=frontcover&dq=python+machine+learning&hl=it&sa=X&ved=0ahUKEwiV0a-h-qDZAhUKWRQKHSakAZ0Q6AEIMTAB#v=onepage&q=python%20machine%20learning&f=false',
        },
        {
            id: 1,
            name: "Pensieri lenti e veloci",
            author: 'Daniel Kahneman',
            link_img: 'views/books/static/img/pensieri_lenti_e_veloci.jpg',
            buy_link: 'https://books.google.it/books?id=L7Jkwb8gRGcC&printsec=frontcover&dq=pensieri+lenti+e+veloci&hl=it&sa=X&ved=0ahUKEwiNj_2J-qDZAhWLOxQKHXjZDTEQ6AEIKDAA#v=onepage&q=pensieri%20lenti%20e%20veloci&f=false',
        },
        {
            id: 2,
            name: "Il cigno nero. Come l'improbabile governa la nostra vita",
            author: 'Nassim Nicholas Taleb',
            link_img: 'views/books/static/img/il_cigno_nero.jpg',
            buy_link: 'https://books.google.it/books?id=1ZLR7UWiNBkC&printsec=frontcover&dq=il+cigno+nero&hl=it&sa=X&ved=0ahUKEwiKwc6_-aDZAhXHzRQKHQrDCKcQ6AEIKDAA#v=onepage&q=il%20cigno%20nero&f=false',
        },
    ]
})