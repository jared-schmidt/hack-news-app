Meteor.methods({
    getHtml: function(url){
        var req = Meteor.http.get(url)
        return req.content;
    }
});
