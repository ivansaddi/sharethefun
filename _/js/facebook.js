window.fbAsyncInit = function() {
            FB.init({ appId: '303279753051820', //change the appId to your appId
                status: true, 
                cookie: true,
                xfbml: true,
				fileUpload : true,
                oauth: true});

		function PostFB(response) {
			var button = document.getElementById('facebook');
	
			if (response.authResponse) {
	  		    //user is already logged in and connected
				button.onclick = function() {
					save(response);
				};
			
			} else {
	  		    //user is not connected to your app or logged out
      			button.onclick = function() {
        			FB.login(function(response) {
						save(response);
        			}, {scope:'email,status_update,publish_stream,user_about_me'});  	
      			}
    		}
  		}

  		// run once with current status and whenever the status changes
  		FB.getLoginStatus(PostFB);
  		FB.Event.subscribe('auth.statusChange', PostFB);	
		};
	
		(function() {
  			var e = document.createElement('script'); e.async = true;
  			e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
  			document.getElementById('fb-root').appendChild(e);
		}());

		var rand;
		function save (response) {
			stage.toDataURL(function(dataUrl){
				//save photo via ajax
				var postData = "canvasData="+dataUrl;	  
				var ajax_save = new XMLHttpRequest();
				document.body.style.cursor = 'wait';
				disable('#facebook');
				console.log('Saving');
			
				// Upload to FB after saving the photo
				ajax_save.onreadystatechange = function(){
					if(ajax_save.readyState == 4 && ajax_save.status == 200){
						rand =  ajax_save.responseText;
						upload(response);
					}
				};
				//specify our php processing page
				ajax_save.open("POST",'save_image.php',true);
				//set the mime type so the image goes through as base64
				ajax_save.setRequestHeader('Content-Type', 'canvas/upload');
				ajax_save.send(postData);
			});
		}

		function upload(response){
			console.log('Uploading');
			var image = 'http://sharethefun.androjuni.com/'+rand+'.png';
			//upload photo and add comment on your post
			FB.api('/photos', 'post', { message: 'Share The Fun! http://sharethefun.androjuni.com', url : image, }, function(response) {
		        if (response == 0){
		            alert('Upload not successful. Give permission to the application.');
		        }
		        else{
					//delete photo via ajax
					console.log('Deleting');
					var ajax_del = new XMLHttpRequest();
					// Redirect to facebook if upload is successful
					ajax_del.onreadystatechange = function(){
						if(ajax_del.readyState == 4 && ajax_del.status == 200){
							document.body.style.cursor = 'default';
							enable('#facebook');
							alert("Upload Successful");
							window.location = "http://www.facebook.com/"
						}
					};
					ajax_del.open("GET",'delete.php?rand='+rand,true);
					ajax_del.send();
		        }
			});
		}
