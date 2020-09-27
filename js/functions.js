function send_message() {
    let title = $('#messagetitle').val()
    let content = $('#messagecontent').val()
    let link = "mailto:mik3dev@gmail.com?subject="+title+"&body=" + content
    window.location.assign(link);
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

function adaptive_title_size(text){
    if(text.length > 20){
        return "<small>"+text+"</small>"
    } else {
        return text
    }
}

function add_games(games){
    var first = true
    for(let game of games){
        var title = game.title
        let link = title.toLowerCase().replace(/\s+/g, '').replace(':', '')
        let linklist = link + '-list'
        var classes = 'list-group-item list-group-item-action text-truncate'
        data_classes = 'tab-pane fade row'
        title = adaptive_title_size(title)
        if(first){
            classes += ' active'
            data_classes += ' show active'
            first = false
        }
        let completetitlemobile = '<p class="d-block d-sm-none">Title: '+title+"</p>"
        let htmllinktag = '<a class="'+classes+'" id="'+linklist+'" data-toggle="list" href="#'+link+'" role="tab" aria-controls="'+link+'">' + title + '</a>'
        games_links_list.append(htmllinktag)
        htmldatatag = ' <div class="'+data_classes+'" id="'+link+'" role="tabpanel" aria-labelledby="'+linklist+'"><div class="p-2 d-none d-sm-block col-4"><img src="'+game.imgpath+'" width="100%"></div><div class="p-1 col-12">'+completetitlemobile+'<span style="color: black" class="text-justify">'+game.description+'</span></div></div>'
        games_content_list.append(htmldatatag)
    }
}

function add_books(books){
    var first = true
    for(let book of books){
        var title = book.title
        let link = title.toLowerCase().replace(/\s+/g, '').replace(':', '').replace(',')
        let linklist = link + '-list'
        var classes = 'list-group-item list-group-item-action text-truncate'
        data_classes = 'tab-pane fade row'
        title = adaptive_title_size(title)
        if(first){
            classes += ' active'
            data_classes += ' show active'
            first = false
        }
        let completetitlemobile = '<p class="d-block d-sm-none">Title: '+title+"</p>"
        let htmllinktag = '<a class="'+classes+'" id="'+linklist+'" data-toggle="list" href="#'+link+'" role="tab" aria-controls="'+link+'">' + title + '</a>'
        books_links_list.append(htmllinktag)
        htmldatatag = ' <div class="'+data_classes+'" id="'+link+'" role="tabpanel" aria-labelledby="'+linklist+'"><div class="p-2 col-4 d-none d-sm-block"><img src="'+book.imgpath+'" width="100%"></div><div class="p-1 col-12">'+completetitlemobile+'<p>'+book.authors+'</p><span style="color: black" class="text-justify">'+book.description+'</span></div></div>'
        books_content_list.append(htmldatatag)
    }
}


get_db_data()

