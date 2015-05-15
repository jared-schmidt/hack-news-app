// if (Meteor.isClient){

//   Template.home.rendered = function(){
//     React.render(
//       <Test />,
//       document.getElementById('yield')
//     );
//   }

//   Test = ReactMeteor.createClass({
//     render: function(){
//       return <div>
//         Web View Test
//       </div>
//     }
//   });
// }

if (Meteor.isCordova){
    Meteor.startup(function(){
      window.cordova.require('org.apache.cordova.inappbrowser.inappbrowser');
    });

  // Wait for device API libraries to load
   //
  //  document.addEventListener("deviceready", onDeviceReady, false);

   // Global InAppBrowser reference
   var iabRef = null;

   function iabLoadStart(event) {
      //  alert(event.type + ' - ' + event.url);
       console.log("Device start");
   }

   function iabLoadStop(event) {
      //  alert(event.type + ' - ' + event.url);
      console.log("Device stop");
      var p = document.createElement("p");
      p.innerHTML = "test1";
      iabRef.executeScript({
       code: "console.log('hello world');document.body.insertBefore("+p+", document.body.firstChild);"
      }, function(){
       alert("done");
      });
   }

   function iabLoadError(event) {
      //  alert(event.type + ' - ' + event.message);
       console.log("Device error");
   }

   function iabClose(event) {
        // alert(event.type);
        console.log("Device close");
        iabRef.removeEventListener('loadstart', iabLoadStart);
        iabRef.removeEventListener('loadstop', iabLoadStop);
        iabRef.removeEventListener('loaderror', iabLoadError);
        iabRef.removeEventListener('exit', iabClose);
   }

   // device APIs are available
   //
   function onDeviceReady() {
        console.log("Device Ready");
   }
}

// if (Meteor.isCordova) {

  Template.home.rendered = function(){
    React.render(
      <NewsBox />,
      document.getElementById('yield')
    );
  };

  NewsBox = ReactMeteor.createClass({
      getMeteorState: function() {
          startTime = new Date();
          return {data: []};
      },
      fetchListData: function() {
          $.ajax({
              url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
              dataType: 'json',
              success: function (data) {
                  this.setState({data: data.slice(0,20)});
              }.bind(this),
              error: function (xhr, status, err) {
                  console.error("/newss", status, err.toString());
              }.bind(this)
          });
      },
      componentWillMount: function() {
          this.fetchListData();
          setInterval(this.fetchListData, 2000000000);
      },
      render: function() {
          return (
              <div className="NewsBox">
                  <h1 className="page_title center">Hacker News</h1>
                  <NewsList data={this.state.data}/>
              </div>
              );
      }
  });

  NewsList = ReactMeteor.createClass({

      render: function() {
          var newss = this.props.data.map( function(news, i) {
              return <News
                key={i}
                news={news} />
          });

          return (
              <div className="inner">
                <div className='container-fluid'>
                {newss}
                </div>
              </div>
          );
      }
  });

  News = ReactMeteor.createClass({
      getMeteorState: function() {
          return {
              title: "Loading...",
              url: '',
              points: 9999
          }
      },
      componentDidMount: function(){
          $.ajax({
              url: 'https://hacker-news.firebaseio.com/v0/item/'+this.props.news+'.json',
              dataType: 'json',
              success: function (data) {
                  this.setState({
                      title: data.title,
                      url: data.url,
                      points: data.score
                  });
              }.bind(this),
              error: function (xhr, status, err) {
                  console.error("/newss", status, err.toString());
              }.bind(this)
          });
      },
      test: function(url){
          iabRef = window.open(url, '_blank', 'location=no');
          iabRef.addEventListener('loadstart', iabLoadStart);
          iabRef.addEventListener('loadstop', iabLoadStop);
          iabRef.removeEventListener('loaderror', iabLoadError);
          iabRef.addEventListener('exit', iabClose);
      },
      render: function() {
          return (
                  <div className='panel panel-default'>
                    <div className="panel-body">
                      <span className='news_title'>
                        <a onClick={this.test.bind(this, this.state.url)} >{this.state.title}</a>
                        // <a href={this.state.url} >{this.state.title}</a>
                      </span>
                    </div>
                    <div className="panel-footer">
                      <span className='news_points'>{this.state.points} points</span>
                    </div>
                  </div>
          );
      }
  });

// }
