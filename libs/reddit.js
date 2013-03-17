$(function() {
  var RedditReader = function() {
    var baseURL = 'http://www.reddit.com/',
        suffix = '.json?jsonp=?',
        currentPostIndex = 0;

    var V = {
      // View
      postTemplate: Template['templates/post.handlebars'],
      imageTemplate: Template['templates/postimage.handlebars'],
      textTemplate: Template['templates/posttext.handlebars'],
      youtubeTemplate: Template['templates/postyoutube.handlebars'],
      body: $('body'),
      posts: $('#posts ul'),
      postItems: ''
    };

    var M = {
      // Model
      posts: []
    };

    var init = function() {
      $.getJSON(baseURL + suffix, function(reddit) {
        console.log(reddit.data);
        parsePosts(reddit.data.children);
      });

      V.body.keypress(function(event) {
        if (event.which === 99) {
          // pressing c opens comments page
          window.open(baseURL + M.posts[currentPostIndex].permalink);
        } else if (event.which === 106) {
          // pressing j moves selection down
          if (currentPostIndex + 1 < V.postItems.length) {
            $(V.postItems[currentPostIndex]).removeClass('selected');
            $(V.postItems[++currentPostIndex]).addClass('selected');
            V.body.scrollTop($(V.postItems[currentPostIndex]).offset().top);
          }
        } else if (event.which === 107) {
          // pressing k moves selection up
          if (currentPostIndex - 1 >= 0) {
            $(V.postItems[currentPostIndex]).removeClass('selected');
            $(V.postItems[--currentPostIndex]).addClass('selected');
            V.body.scrollTop($(V.postItems[currentPostIndex]).offset().top);
          }
        } else if (event.which === 111) {
          // pressing o opens the link of selection
          window.open($(V.postItems[currentPostIndex]).attr('href'));
        }
      });
    };

    var parsePosts = function(posts) {
      var list = [];
      for (var i = 0; i < posts.length; i++) {
        var p = posts[i].data;
        M.posts.push(p);

        if (p.domain === 'youtube.com') {
          p.youtubeId = p.url.split('v=')[1];
          list.push(V.youtubeTemplate(p));
        } else if (isUrlAnImage(p.url)) {
          list.push(V.imageTemplate(p));
        } else if (p.selftext !== '') {
          list.push(V.textTemplate(p));
        } else {
          list.push(V.postTemplate(p));
        }
      }

      V.posts.append(list);
      V.postItems = V.posts.find('.post-link');
      $(V.postItems[currentPostIndex]).addClass('selected');
    };

    var isUrlAnImage = function(url) {
      return (url.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    };

    return {
      init: init
    };

  }();

  RedditReader.init();
});