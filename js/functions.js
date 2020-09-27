function send_message() {
    let content = $('#messagecontent').val()
    
}


function get_db_data(){
    fetch("data.json")
    .then(response => response.json())
    .then(json => {
        add_games(json['Games']);
        add_books(json['Books'])
    })
}

let games_content_list = $('#nav-tabContent-games')
let games_links_list = $('#list-tab-games')
let books_content_list = $('#nav-tabContent-books')
let books_links_list = $('#list-tab-books')


function add_games(games){
    var first = true
    for(let game of games){
        let title = game.title
        let link = title.toLowerCase().replace(/\s+/g, '').replace(':', '')
        let linklist = link + '-list'
        var classes = 'list-group-item list-group-item-action'
        data_classes = 'tab-pane fade row'
        if(first){
            classes += ' active'
            data_classes += ' show active'
            first = false
        }
        let htmllinktag = '<a class="'+classes+'" id="'+linklist+'" data-toggle="list" href="#'+link+'" role="tab" aria-controls="'+link+'">' + title + '</a>'
        games_links_list.append(htmllinktag)
        htmldatatag = ' <div class="'+data_classes+'" id="'+link+'" role="tabpanel" aria-labelledby="'+linklist+'"><div class="p-2 col-4"><img src="'+game.imgpath+'" width="100%"></div><div class="p-1 col-8"><small style="color: black">'+game.description+'</small></div></div>'
        games_content_list.append(htmldatatag)
    }
}

function add_books(books){
    var first = true
    for(let book of books){
        let title = book.title
        let link = title.toLowerCase().replace(/\s+/g, '').replace(':', '').replace(',')
        let linklist = link + '-list'
        var classes = 'list-group-item list-group-item-action'
        data_classes = 'tab-pane fade row'
        if(first){
            classes += ' active'
            data_classes += ' show active'
            first = false
        }
        let htmllinktag = '<a class="'+classes+'" id="'+linklist+'" data-toggle="list" href="#'+link+'" role="tab" aria-controls="'+link+'">' + title + '</a>'
        books_links_list.append(htmllinktag)
        htmldatatag = ' <div class="'+data_classes+'" id="'+link+'" role="tabpanel" aria-labelledby="'+linklist+'"><div class="p-2 col-4"><img src="'+book.imgpath+'" width="100%"></div><div class="p-1 col-8"><p>'+book.authors+'</p><small style="color: black">'+book.description+'</small></div></div>'
        books_content_list.append(htmldatatag)
    }
}


get_db_data()

