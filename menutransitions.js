for (let i = 1; i < 4; i++) {
    console.log(i)
    $('#v-pills-tab a:nth-child(' + i + ')').on('ended', function(e){
        console.log(i)
        if(i < 3){
            $('#v-pills-tab a:nth-child(' + (i+1) + ')').tab('show')
        }
    })
    
}