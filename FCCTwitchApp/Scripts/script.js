/// <reference path="_references.js" />
/*jslint browser: true*/
/*global $, jQuery, alert*/

function Streamer(displayName, online, status, url, game, channelId, logo) {
    "use strict";
    this.displayName = displayName;
    this.online = online;
    this.status = status;
    this.url = url;
    this.game = game;
    this.channelId = channelId;
    this.logo = logo;
    this.toConsole = function () {
        console.log("DName: " + this.displayName
            + " Online: " + this.online
            + " Status: " + this.status
            + " Url: " + this.url
            + " Game: " + this.game
            + " Cid: " + this.channelId
            + " Logo: " + this.logo);
    };
}

$(function () {
    "use strict";
    var following = ["OgamingSC2", "freecodecamp", "brunofin", "comster404", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "bearchab"];
    var jFollowers = following.join();

var channels = [];
    var streamers = [];
    var streams = [];
   
    var online = [];
    var followLength = following.length;
    var allApiTasks = [];
    function processStreamers() {

        streamers.forEach(function (item, index, arr) {
            if (item.online) {
                createPanel(item, "online");
            }
        });
       
        streamers.forEach(function (item, index, arr) {
            if (item.status != "Account Closed") {
                if (item.online === false) {
                    item.status = "Offline";
                    createPanel(item, "offline");
                }
            }

        });
        streamers.forEach(function (item, index, arr) {
            if (item.status === "Account Closed") {
                item.url = "#";
                createPanel(item, "closed inactive");
            }
        });
    }

    function createPanel(streamer, cssClass){
        var cStream = streamer;
        var panelHtml = '<div class="panel ' + cssClass + ' ">'
            + '<div class="panel-body">'
            + '<span class="logo" id="logo"></span>'
            + '<img height="40" width="40" src="' + cStream.logo + '">'
            + '<a href="' + cStream.url + '">' + cStream.displayName + '</a>'
             + '<span class="status pull-right">' + cStream.status + '</span>'
            + '</div></div></div>';
        $('#panels').append(panelHtml);
    }



    function showAll() {
        $('.online').show(500);
        $('.offline').show(500);
        $('.closed').show(500);
    }
    function clearPanels() {
        $('#panels').empty();
        return false;
    }
    function showOnline() {
        $('.online').show(500);
        $('.offline').hide(500);
      $('.closed').hide(500);
    }
    function showOffline() {
        $('.online').hide(500);
        $('.offline').show(500);
        $('.closed').hide(500);
    }


    $('#btnAll').click(function () {
        showAll();
        return false;
    });
    
$('#btnOnline').click(function () {
        showOnline();
        return false;
    });
    $('#btnOffline').click(function () {
        showOffline();
        return false;
    });
    
    var runAjax = function (data) {
        return $.ajax({
            url: data.url,
            method: 'GET',
            dataType: 'jsonp'
        });
    };
    
    

    
 following.forEach(getStreamers);
    
        function getStreamers(element, index, array) {
            console.log(element + " " + index);
            streams.push(
               runAjax({ url: 'https://api.twitch.tv/kraken/channels/' + element }) //+'?'
                );
        }

       function getOnline(){
           $.getJSON('https://api.twitch.tv/kraken/streams?channel=' + jFollowers + "?", function (json) {
               console.log(json);
               var onLength = json.streams.length;
               for (var i = 0; i < onLength; i++) {
                   var target = json.streams[i].channel._id;
                   var currentStreamer = streamers.filter(function (obj) {
                       return obj.channelId == target;
                   })
                   
                   currentStreamer[0].online = true;
                   console.log(currentStreamer);
                   
               }
processStreamers();


           })

                
       }

        $.when.apply(this, streams).done(function () {
            console.log(arguments);
            var aLength = arguments.length;


            for (var i = 0; i < aLength; i++) {
                var newStreamer = new Streamer(arguments[i][0].display_name, false, arguments[i][0].status, arguments[i][0].url, arguments[i][0].game, arguments[i][0]._id, arguments[i][0].logo);
                if (newStreamer.logo === null) {
                    newStreamer.logo = "http://tr3.cbsistatic.com/fly/332-fly/bundles/techrepubliccore/images/icons/standard/icon-user-default.png";
                }
                if (newStreamer.status == "422") {
                    newStreamer.status = "Account Closed";
                    newStreamer.logo = "http://www-cdn.jtvnw.net/images/xarth/404_user_50x50.png";
                    newStreamer.displayName = following[i];
                }
                newStreamer.toConsole();
                streamers.push(newStreamer);
            }
            getOnline();

          

        });



    
})