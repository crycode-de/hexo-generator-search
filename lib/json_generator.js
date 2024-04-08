var pathFn = require('path');
var fs = require('fs');

module.exports = function(locals){
    var config = this.config;
    var searchConfig = config.search;
    var searchfield = searchConfig.field;
    var content = searchConfig.content;
    if (content == undefined) content = true;
    var stripHtml = searchConfig.strip_html;
    if (stripHtml == undefined) stripHtml = false;
    var permalinks = searchConfig.permalinks;
    if (permalinks == undefined) permalinks = false;

    var posts, pages;

    if(searchfield.trim() != ''){
        searchfield = searchfield.trim();
        if(searchfield == 'post'){
            posts = locals.posts.sort('-date');
        }else if(searchfield == 'page'){
            pages = locals.pages;
        }else{
            posts = locals.posts.sort('-date');
            pages = locals.pages;
        }
    }else{
        posts = locals.posts.sort('-date');
    }

    var res = new Array()
    var index = 0

    if(posts){
        posts.each(function(post) {
            if (post.indexing != undefined && !post.indexing) return;
            var temp_post = new Object()
            temp_post.title = post.title || 'No Title'
            if (post.path) {
                temp_post.url = config.root + post.path
            }
            if (content != false) {
                if (content == 'rendered' && post.content) {
                    temp_post.content = post.content
                } else if (content == 'excerpt' && post.excerpt) {
                    temp_post.content = post.excerpt
                } else if (content == 'raw' && post.raw) {
                    temp_post.content = post.raw
                } else if (post._content) {
                    temp_post.content = post._content
                }
                if (stripHtml) {
                    temp_post.content = temp_post.content.replace(/<[^>]+>/g, '')
                }
            }
            temp_post.tags = [];
            if (post.tags && post.tags.length > 0) {
                post.tags.forEach(function (tag) {
                    if (permalinks) {
                        temp_post.tags.push([ tag.name, tag.permalink ]);
                    } else {
                        temp_post.tags.push(tag.name);
                    }
                });
            }
            temp_post.categories = [];
            if (post.categories && post.categories.length > 0) {
                post.categories.forEach(function (cate) {
                    if (permalinks) {
                        temp_post.categories.push([ cate.name, cate.permalink ]);
                    } else {
                        temp_post.categories.push(cate.name);
                    }
                });
            }
            res[index] = temp_post;
            index += 1;
	    });
    }
    if(pages){
        pages.each(function(page){
            if (page.indexing != undefined && !page.indexing) return;
            var temp_page = new Object()
            temp_page.title = page.title || 'No Title'
            if (page.path) {
                temp_page.url = config.root + page.path
            }
            if (content != false) {
                if (content == 'rendered' && page.content) {
                    temp_page.content = page.content
                } else if (content == 'excerpt' && page.excerpt) {
                    temp_page.content = page.excerpt
                } else if (content == 'raw' && page.raw) {
                    temp_page.content = page.raw
                } else if (page._content) {
                    temp_page.content = page._content
                }
                if (stripHtml) {
                    temp_post.content = temp_post.content.replace(/<[^>]+>/g, '')
                }
            }
            res[index] = temp_page;
            index += 1;
        });
    }


    var json = JSON.stringify(res);

    return {
        path: searchConfig.path,
        data: json
    };
};
