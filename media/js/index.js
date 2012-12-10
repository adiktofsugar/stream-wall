var log = function (msg, obj) {
	if (window.console && console.log && console.dir) {
		msg && console.log(msg);
		obj && console.dir(obj);
	}
};

(function () {
    
    $(document).ready(function () {
        
        var $template = $('script#index-post[type="text/template"]'),
            templateText = $template.html(),
            template = new EJS({ text: templateText }),
            $posts = $('ul#posts');
        
        
        var socket = io.connect(window.location.toString());
        socket.on('post', function (post) {
            log(undefined, post);
            if (post) {
                var $post = $(template.render({ post: post }))
                    .prependTo($posts)
                    .css({
                        height:0,
                        overflowY:"hidden",
                        display:"block"
                    });
                $post.animate({
                    height: $post[0].scrollHeight
                }, function () {
                    $post.css("height", "auto");
                });
            }
        });
        
        
        var $form = $('#post-form')
            .on("submit", function (event) {
                event.preventDefault();
                var $input = $form.find('input');
                
                socket.emit('post', $input.val());
                
                $input.val('');
            });
        $form.find("input").focus();
    });
}());
