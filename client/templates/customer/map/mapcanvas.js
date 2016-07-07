Template.mapCanvas.onCreated(function() {
  this.mapDragged = new ReactiveVar(false);
});

Template.mapCanvas.rendered = function() { //1

  var tmpl = this;
  var searchInput = this.$('#address');

  VazcoMaps.init({ //2

    key: 'AIzaSyC0ZyvGaREkHqu86wYzEtKZRf-MLvmtrcg'

    //c2
  }, function() { //3

    tmpl.mapEngine = VazcoMaps.gMaps();

    tmpl.newMap = new tmpl.mapEngine({ //4
      div: '#map-canvas',
      lat: 30.2745,
      lng: -97.7404,
      tilt: 0,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoom: 25
    }); // c4

    var marker = tmpl.newMap.addMarker({ //1
      lat: 30.2745,
      lng: -97.7404,
      draggable: true,
      dragend: function() { //2

          //set session when map loaded
          Session.set('mapLat', '30.2745');
          Session.set('mapLon', '-97.7404');

          var point = this.getPosition();
          //3
          tmpl.mapEngine.geocode({
            location: point,
            callback: function(results) { //4
              var latlng = results[0].geometry.location;
              searchInput.val(results[0].formatted_address);
              tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
              tmpl.newMap.setTilt(0);

              //set session when map loaded and pin dragged
              Session.set('mapLat', latlng.lat());
              Session.set('mapLon', latlng.lng());

            }
          }); //c3 c4
        } //2
    }); //1
    marker.addListener('dragend', function(event) {
      console.log("entro este");
      Session.set('mapLat', event.latLng.lat());
      Session.set('mapLon', event.latLng.lng());
    });

  }); //c3

}; //c4

Template.mapCanvas.events({
  'submit #mapsubmit': function(e, tmpl) {
    e.preventDefault();
    var searchInput = $(e.target).find('#address');

    //message for pin location
    Session.set('mapMessage', true);

    tmpl.newMap.removeMarkers();
    tmpl.mapEngine.geocode({
      address: searchInput.val(),
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;

          //set session when address selected
          Session.set('mapLat', latlng.lat());
          Session.set('mapLon', latlng.lng());

          tmpl.newMap.setCenter(latlng.lat(), latlng.lng());
          var marker = tmpl.newMap.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng(),
            draggable: true,
            dragend: function() {
              var point = this.getPosition();

              tmpl.mapEngine.geocode({
                location: point,
                callback: function(results) {
                  if (!tmpl.mapDragged.get) {
                    searchInput.val(results[0].formatted_address);
                  }

                  tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                  tmpl.newMap.setTilt(0);

                  //set session when pin dragged after address selected
                  Session.set('mapLat', results[0].geometry.location.lat());
                  Session.set('mapLon', results[0].geometry.location.lng());
                }
              });
            }
          });

          marker.addListener('dragend', function(event) {
            tmpl.mapDragged.set(true);
            Session.set('mapLat', event.latLng.lat());
            Session.set('mapLon', event.latLng.lng());
          });

          searchInput.val(results[0].formatted_address);
          Session.set('this_address', searchInput.val());



        } else {
          console.log(status);
        }
      }
    });
  }
});
