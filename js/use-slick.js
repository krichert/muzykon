var autoPlaySpeed = 3000;
var prevButtonNews = '<button type="button" style="top: calc(50% - 19px); left: 20px; " class="app-slider-btn app-text-primary" data-role="none">&#60;</button>';
var nextButtonNews = '<button type="button" style="top: calc(50% - 19px); right: 20px; " class="app-slider-btn app-text-primary" data-role="none">&#62;</button>';

$('.news-slick-container').slick({
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    touchMove: true,
    prevArrow: prevButtonNews,
    nextArrow: nextButtonNews,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
});

var prevButtonCrew = '<button type="button" style="top: calc(50% - 19px); left: 20px; " class="app-slider-btn app-text-primary" data-role="none">&#60;</button>';
var nextButtonCrew = '<button type="button" style="top: calc(50% - 19px); right: 20px; " class="app-slider-btn app-text-primary" data-role="none">&#62;</button>';

$('.crew-slick-container').slick({
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    touchMove: true,
    prevArrow: prevButtonCrew,
    nextArrow: nextButtonCrew,
    responsive: [
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
});

var prevButtonGallery = '<button type="button" style="bottom: -22px; right: calc(50% + 15px); width: 65px;" class="app-slider-btn" data-role="none"><img class="img-fluid" src="./img/next-left.png" /></button>';
var nextButtonGallery = '<button type="button" style="bottom: -22px; left: calc(50% + 15px); width: 65px;" class="app-slider-btn" data-role="none"><img class="img-fluid" src="./img/next-right.png" /></button>';

$('.gallery-slick-container').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: prevButtonGallery,
    nextArrow: nextButtonGallery,
    centerMode: true,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
});
