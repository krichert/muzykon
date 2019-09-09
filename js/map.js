function initMap() {
    var slowackiego = {lat: 54.3800396, lng: 18.585334};
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 15   , center: slowackiego});
    var marker = new google.maps.Marker({position: slowackiego, map: map});
}