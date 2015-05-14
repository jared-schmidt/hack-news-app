Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function(){
    this.route('home',{
        path: '/',
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
        }
    });
});
