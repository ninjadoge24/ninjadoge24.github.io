/**
 * blog.js
 *
 * author: ninjadoge24 <ninjadoge24@gmail.com>
 * license: WTFPL (any year)
 */

var Blog = (function() {
    'use strict';

    var posts = [];
    var selected;
    var index;
    var info;
    var article;

    var init = function init(settings) {
        selected = window.location.hash.substr(1);
        index = settings.index;
        info = settings.info;
        article = settings.article;

        info.empty();

        if (index.length === 0) {
            info.html('There aren\'t any posts yet! Come back later.');
            return;
        }

        if (selected && index.indexOf(selected) === -1) {
            article.empty();
            info.html('That post doesn\'t exist.');
            return;
        }

        if (article.children('section').length !== index.length) {
            var i = index.length;
            while (i--) {
                var section = '<section class="markdown-body" id="' + index[i] + '"></section>';
                article.append(section);
            }
        }

        if (posts.length === 0) {
            fetch(render);
        } else {
            render();
        }

        window.onhashchange = function() {
            init(settings);
        };
    };

    var fetch = function fetch(callback) {
        info.html('Fetching posts&hellip;');

        var get = function get(i, callback) {
            $.get('posts/' + index[i] + '.md', function(content) {
                parse(i, content, callback);
            });
        };

        var parse = function format(i, content, callback) {
            var url = 'https://github.com/ninjadoge24/ninjadoge24.github.io/';
            var slug = index[i] + '.md';

            var permalink = '\n[permalink](#' + index[i] + ')';
            var history = '\n[history](' + url + 'commits/master/posts/' + slug + ')';
            var edit = '\n[edit](' + url + 'edit/master/posts/' + slug + ')';

            content = content.replace(/https:\/\/ninjadoge24.github.io\//g, '');
            posts[i] = $(marked(content + permalink + history + edit))

            $('pre code', posts[i]).each(function(i, block) {
                if ($(block).attr('class')) {
                    hljs.highlightBlock(block);
                }
            });

            var title = posts[i].first().html();
            var link = '<a href="#' + index[i] + '">' + title + '</a>';

            posts[i].first().html(link);

            callback();
        }

        var count = function count() {
            var total = 0;
            for (var post in posts) {
                if (!isNaN(post)) {
                    total++;
                }
            }

            if (total === index.length) {
                callback();
            }
        };

        var i = index.length;
        while (i--) {
            get(i, count);
        }
    };

    var render = function render() {
        info.empty();
        document.title = 'ninjadoge24\'s blog';

        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 100);

        var i = index.length;
        while (i--) {
            var id = '#' + index[i];

            if (selected && '#' + selected !== id) {
                if ($(id).html()) {
                    $(id).empty();
                }
                continue;
            }

            $(id).html(posts[i]);

            var title = posts[i].children().first().html();
            if (selected) {
                document.title = title + ' - ninjadoge24\'s blog';
            }
        }
    };

    return {
        init: init
    };
})();

$(document).ready(function() {
    Blog.init({
        index: Index,
        info: $('.info'),
        article: $('article')
    });
});
