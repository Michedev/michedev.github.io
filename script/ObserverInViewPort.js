done_secondscene = false;
function animateText(element)
{
    if(element.classList.contains("first"))
    {
        var topText = $("#toptext1");
        var topText2 = $("#toptext2");
        showAndAddClassTo(topText, "animated fadeIn");
        showAndAddClassWithDelay(topText2, "animated fadeIn", 750);

    }
    /*else
    if(element.classList.contains("second") && !done_secondscene)
    {
        done_secondscene = true;
        durationAnimation = 4;
        mainDiv = (element.children[0]);
        suffix = "#midtext";
        for(i = 1; i <= mainDiv.children.length; i++)
        {
                $(".typedText").css({"width": $(suffix+(i)).css("width")});
                showAndAddClassWithDelay($(suffix+(i)) , "typedText", 0);
        }
    }*/
    else
    if(element.classList.contains("third"))
    {
        showAndAddClassTo($("#textpresentation"), "animated flash");
    }
}








function deanimateText(element)
{
    if(element.classList.contains("first"))
    {
        var topText = $("#toptext");
        var topText2 = $("#toptext2");
        removeClassAndHide(topText, "animated fadeIn");
        removeClassAndHide(topText2, "animated fadeIn");
    }
    else
       if(element.classList.contains("second"))
        {
            mainDiv = (element.children[0]);
            suffix = "#midtext";
            for(i = 1; i <= mainDiv.children.length; i++)
            {

                    removeClassAndHide($(suffix+(i)) , "typedText");
            }
        }
}




function showAndAddClassTo (el, animationNames)
{
    el.show();
    el.addClass(animationNames);
}

function removeClassAndHide (el, animationNames)
{
    el.removeClass(animationNames);
    el.hide();
}


function removeClassAndHideWithDelay(el, classNames, delay)
{
    window.setTimeout(function()
        {
            text_i = $(suffix+(i));
            showAndAddClassTo( text_i,  "typedText");
        },  delay);
}


function showAndAddClassWithDelay(el, classNames, delay)
{
    window.setTimeout(function()
        {
            showAndAddClassTo( el,  classNames);
        },  delay);
}


$('.observable').on('inview', function(event, isInView) {
  if (isInView) {
    animateText(event.currentTarget);
  } else {
    //deanimateText(event.currentTarget);
  }
});
